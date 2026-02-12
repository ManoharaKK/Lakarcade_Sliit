'use client'
import React, { useState } from 'react'
import { NftMeta } from '../../../types/nft'
import axios from 'axios'
import { useWeb3 } from '@/components/providers/web3'



/** Form state: image can be a File during input, or string (URL) */
type FormNftMeta = Omit<NftMeta, 'image'> & { image: string | File | null }

interface NFTFormProps {
  onSubmit: (data: any) => void
}

const initialMeta: FormNftMeta = {
  name: '',
  description: '',
  image: '',
  attributes: [
    { trait_type: 'health', value: '0' },
    { trait_type: 'attack', value: '0' },
    { trait_type: 'speed', value: '0' }
  ]
}

const getSignedData = async (ethereum: unknown) => {
  const messageToSign = await axios.get("/api/verify", { withCredentials: true });
  const accounts = await (ethereum as { request: (args: unknown) => Promise<string[]> })?.request({ method: 'eth_requestAccounts' }) as string[];
  const account = accounts[0];

  const signedData = await (ethereum as { request: (args: unknown) => Promise<unknown> })?.request({
    method: 'personal_sign',
    params: [JSON.stringify(messageToSign.data), account],
  });

  return { signedData, account };
}

function NFTForm({ onSubmit }: NFTFormProps) {
  const [nftURI, setNftURI] = useState('');
  const [hasUsedURI, setHasUsedURI] = useState(false);
  const [nftMeta, setNftMeta] = useState<FormNftMeta>(initialMeta)
  const [submitting, setSubmitting] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const { ethereum } = useWeb3()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNftMeta(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNftMeta(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.trait_type === name ? { ...attr, value } : attr
      )
    }))
  }

  const getAttr = (traitType: string) =>
    nftMeta.attributes.find(a => a.trait_type === traitType)?.value ?? ''

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.error("Select a file")
      return;
    }
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) return;

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setNftMeta(prev => ({ ...prev, image: file }));

    const buffer = await file.arrayBuffer();
    const bytes = Array.from(new Uint8Array(buffer));
    try {
      const { signedData, account } = await getSignedData(ethereum);
      const res = await axios.post("/api/verify-image", {
        address: account,
        signature: signedData,
        bytes,
        contentType: file.type || "image/jpeg",
        filename: file.name.replace(/\.[^/.]+$/, "") || "image",
      }, { withCredentials: true });
      console.log(res.data);
    } catch (error) {
      console.error("Failed to get signed data:", error)
    }
  }

  const clearImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setNftMeta(prev => ({ ...prev, image: "" }));
  }

  /** Convert image (File or string) to a string URL for the API */
  const imageToUrl = (img: string | File | null): Promise<string> => {
    if (!img) return Promise.resolve('')
    if (typeof img === 'string') return Promise.resolve(img)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(img)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    let contractAddress: string | undefined
    let id: string | undefined
    try {
      // 1) GET message first so we always have contractAddress + id to show
      const { data: messageData } = await axios.get("/api/verify", { withCredentials: true })
      contractAddress = messageData?.contractAddress
      id = messageData?.id
      if (!contractAddress || !id) {
        throw new Error('Could not get contractAddress or id from server')
      }

      if (!ethereum) {
        throw new Error('Wallet not available')
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      const address = accounts[0]
      if (!address) throw new Error('No wallet address')

      // 2) Sign the message (same format server expects)
      const messageToSign = JSON.stringify(messageData)
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [messageToSign, address],
      }) as string

      // 3) Build nft payload: name, description, image (URL string), attributes
      const imageUrl = await imageToUrl(nftMeta.image)
      const nft = {
        name: nftMeta.name,
        description: nftMeta.description,
        image: imageUrl,
        attributes: nftMeta.attributes,
      }

      // 4) POST so server can verify signature and pin to Pinata
      const { data: postData } = await axios.post(
        "/api/verify",
        { address, signature, nft },
        { withCredentials: true }
      )

      onSubmit({ ...nftMeta, contractAddress, id, ipfs: postData })
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
      setNftMeta(initialMeta)
    } catch (error) {
      console.error("Failed to verify / pin NFT:", error)
      onSubmit({ ...nftMeta, contractAddress, id })
    } finally {
      setSubmitting(false)
    }
  }

  const uploadMetadata = async () => {
    try {
      const { signedData, account } = await getSignedData(ethereum);

     const res =  await axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: nftMeta
      }, { withCredentials: true })

      const data = res.data as { IpfsHash?: string; [k: string]: unknown };
      if (data.IpfsHash) {
        setNftURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);
      }
    } catch (error) {
      console.error("Failed to create NFT:", error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create NFT Card</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            value={nftMeta.name}
            type="text"
            id="name"
            name="name"
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter NFT name"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={nftMeta.description}
            id="description"
            name="description"
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter NFT description"
          />
        </div>

        {/* Image Upload (optional) */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image Upload <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {(imagePreviewUrl || (typeof nftMeta.image === "string" && nftMeta.image)) && (
            <div className="mt-3">
              <img
                src={imagePreviewUrl || (nftMeta.image as string)}
                alt="Preview"
                className="max-h-48 w-auto rounded-lg border border-gray-200 object-contain"
              />
              <p className="mt-1 text-sm text-gray-600">
                {nftMeta.image && typeof nftMeta.image !== "string" ? nftMeta.image.name : "Image"}
              </p>
              <button
                type="button"
                onClick={clearImage}
                className="mt-1 text-sm text-red-600 hover:text-red-800"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="attack" className="block text-sm font-medium text-gray-700 mb-1">
              Attack
            </label>
            <input
              type="number"
              id="attack"
              name="attack"
              value={getAttr('attack')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="40"
            />
          </div>
          <div>
            <label htmlFor="health" className="block text-sm font-medium text-gray-700 mb-1">
              Health
            </label>
            <input
              type="number"
              id="health"
              name="health"
              value={getAttr('health')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
            />
          </div>
          <div>
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-1">
              Speed
            </label>
            <input
              type="number"
              id="speed"
              name="speed"
              value={getAttr('speed')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="30"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          onClick={uploadMetadata}
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Getting message…" : "Upload Metadata"}
        </button>
      </form>
    </div>
  )
}

export default NFTForm

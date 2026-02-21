'use client'
import { formatEther } from 'ethers';
import React, { useState } from 'react'
import { NftMeta } from '../../../types/nft'
import axios from 'axios'
import { useWeb3 } from '@/components/providers/web3'
const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

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
  const [price, setPrice] = useState<string>('')
  const { ethereum, contract } = useWeb3()

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
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setNftMeta(prev => ({ ...prev, image: file }));

    const buffer = await file.arrayBuffer();
    const bytes = Array.from(new Uint8Array(buffer));
    const toastId = toast.loading("Uploading image to Pinata...");
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
      toast.update(toastId, {
        render: "Image uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || "Failed to upload image";
      console.error("Failed to get signed data:", error);
      toast.update(toastId, {
        render: `Image upload failed: ${msg}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
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
    const toastId = toast.loading("Submitting form...");
    let contractAddress: string | undefined
    let id: string | undefined
    try {
      // 1) GET message first so we always have contractAddress + id to show
      toast.update(toastId, {
        render: "Fetching contract information...",
        type: "info",
        isLoading: true,
      });
      const { data: messageData } = await axios.get("/api/verify", { withCredentials: true })
      contractAddress = messageData?.contractAddress
      id = messageData?.id
      if (!contractAddress || !id) {
        throw new Error('Could not get contractAddress or id from server')
      }

      if (!ethereum) {
        throw new Error('Wallet not available')
      }
      toast.update(toastId, {
        render: "Requesting wallet signature...",
        type: "info",
        isLoading: true,
      });
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
      toast.update(toastId, {
        render: "Preparing NFT metadata...",
        type: "info",
        isLoading: true,
      });
      const imageUrl = await imageToUrl(nftMeta.image)
      const nft = {
        name: nftMeta.name,
        description: nftMeta.description,
        image: imageUrl,
        attributes: nftMeta.attributes,
      }

      // 4) POST so server can verify signature and pin to Pinata
      toast.update(toastId, {
        render: "Uploading to Pinata...",
        type: "info",
        isLoading: true,
      });
      const { data: postData } = await axios.post(
        "/api/verify",
        { address, signature, nft },
        { withCredentials: true }
      )

      onSubmit({ ...nftMeta, contractAddress, id, ipfs: postData })
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
      setNftMeta(initialMeta)
      toast.update(toastId, {
        render: "Form submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || "Failed to submit form";
      console.error("Failed to verify / pin NFT:", error)
      onSubmit({ ...nftMeta, contractAddress, id })
      toast.update(toastId, {
        render: `Form submission failed: ${msg}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false)
    }
  }

  const uploadMetadata = async () => {
    const toastId = toast.loading("Uploading metadata to Pinata...");
    try {
      // Build nft payload with proper image URL
      let imageUrl: string;
      if (typeof nftMeta.image === "string") {
        imageUrl = nftMeta.image;
      } else if (nftMeta.image instanceof File) {
        imageUrl = await imageToUrl(nftMeta.image);
      } else {
        imageUrl = "";
      }

      const nft = {
        name: nftMeta.name,
        description: nftMeta.description,
        image: imageUrl,
        attributes: nftMeta.attributes,
      }

      const { signedData, account } = await getSignedData(ethereum);

      const res = await axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: nft
      }, { withCredentials: true })

      const data = res.data as { IpfsHash?: string;[k: string]: unknown };
      if (data.IpfsHash) {
        const metadataURI = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN || 'https://gateway.pinata.cloud'}/ipfs/${data.IpfsHash}`;
        setNftURI(metadataURI);
        toast.update(toastId, {
          render: "Metadata uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error("No IPFS hash returned from server");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || "Failed to upload metadata";
      console.error("Failed to upload metadata:", msg);
      toast.update(toastId, {
        render: `Metadata upload failed: ${msg}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }


  const createNft = async () => {
    const toastId = toast.loading("Creating NFT on blockchain...");
    try {
      const nftRes = await axios.get(nftURI);
      const content = nftRes.data;

      Object.keys(content).forEach(key => {
        if (!ALLOWED_FIELDS.includes(key)) {
          throw new Error("Invalid Json structure");
        }
      })

      if (!contract) {
        throw new Error("Contract not available");
      }

      const priceInWei = ethers.parseEther(price);
      const listingPriceWei = "25000000000000000"; // 0.025 ETH in wei

      toast.update(toastId, {
        render: "Waiting for transaction confirmation...",
        type: "info",
        isLoading: true,
      });

      const tx = await contract.mintToken(
        nftURI,
        priceInWei.toString(),
        { value: listingPriceWei }
      );

      if (!tx) {
        throw new Error("Transaction failed");
      }

      await tx.wait();
      toast.update(toastId, {
        render: "NFT created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });


    } catch (e: any) {
      const errorMsg = e.message || e.reason || "Failed to create NFT";
      console.error("Failed to create NFT:", errorMsg);
      toast.update(toastId, {
        render: `NFT creation failed: ${errorMsg}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
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
          type="button"
          onClick={uploadMetadata}
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Uploading…" : "Upload Metadata"}
        </button>
      </form>

      {/* Create NFT Section - shows after metadata is uploaded */}
      {nftURI && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create NFT</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metadata URI
              </label>
              <input
                type="text"
                value={nftURI}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (ETH)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.1"
              />
            </div>
            <button
              onClick={createNft}
              type="button"
              disabled={!price || parseFloat(price) <= 0}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              List
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NFTForm

'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  NftMeta,
  ARTIFACT_TYPE_OPTIONS,
  COMMUNITY_PERKS_OPTIONS,
  MEMBERSHIP_LEVEL_OPTIONS,
  ACCESS_LEVEL_OPTIONS,
  RESOURCE_UNLOCK_SCORE_OPTIONS,
} from '../../../types/nft'
import axios from 'axios'
import { useWeb3 } from '@/components/providers/web3'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import {
  FiType,
  FiLayers,
  FiMapPin,
  FiFileText,
  FiImage,
  FiDollarSign,
  FiCheckSquare,
  FiBook,
  FiInfo,
  FiUser,
  FiChevronDown,
  FiUpload,
  FiX,
} from 'react-icons/fi'

function SectionCard({
  title,
  icon: Icon,
  children,
  fullWidth,
}: {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={`group relative bg-primary border border-secondarybrown/20 overflow-hidden transition-all duration-200 ${fullWidth ? 'lg:col-span-2' : ''}`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondarybrown/40" aria-hidden />
      <div className="p-6 sm:p-7 pl-7 sm:pl-8">
        <div className="flex items-center gap-3 mb-5">
          {Icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondarybrown/15 text-secondarybrown">
              <Icon className="w-5 h-5" />
            </span>
          )}
          <h3 className="text-lg font-semibold tracking-tight text-blackbrown">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}

const REQUIRED_METADATA_KEYS = ["name", "description", "attributes"];
const ALLOWED_FIELDS = [
  "name", "description", "image", "attributes",
  "collectionName", "collectionYear", "pieceNumber", "totalPiecesInCollection",
  "originLocation", "historicalPeriod", "artifactType",
  "mintPriceEth", "usdEquivalent", "communityPerks", "sourceReference", "disclaimer",
];

const HERITAGE_DISCLAIMER =
  "Important: These artworks are non-sellable physical objects of national heritage. The NFT represents a digital ownership token and community access right — not ownership of the physical artwork. All proceeds support heritage preservation.";

/** Form state: image can be File or string (URL) */
type FormNftMeta = Omit<NftMeta, 'image'> & {
  image: string | File | null;
  collectionName: string;
  collectionYear: string;
  pieceNumber: string;
  totalPiecesInCollection: string;
  originLocation: string;
  historicalPeriod: string;
  artifactType: string;
  mintPriceEth: string;
  usdEquivalent: string;
  communityPerks: string[];
  sourceReference: string;
};

interface NFTFormProps {
  onSubmit: (data: any) => void
}

const initialMeta: FormNftMeta = {
  name: '',
  description: '',
  image: '',
  attributes: [
    { trait_type: 'membershipLevel', value: '' },
    { trait_type: 'accessLevel', value: '' },
    { trait_type: 'resourceUnlockScore', value: '' },
  ],
  collectionName: '',
  collectionYear: '',
  pieceNumber: '',
  totalPiecesInCollection: '10000',
  originLocation: '',
  historicalPeriod: '',
  artifactType: '',
  mintPriceEth: '',
  usdEquivalent: '',
  communityPerks: [],
  sourceReference: '',
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
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [price, setPrice] = useState<string>('')
  const [ethToUsdRate, setEthToUsdRate] = useState<number | null>(null)
  const { ethereum, contract } = useWeb3()

  // Fetch ETH → USD rate for Mint Price conversion (CoinGecko free API)
  useEffect(() => {
    let cancelled = false
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then((res) => res.json())
      .then((data: { ethereum?: { usd?: number } }) => {
        if (cancelled) return
        const rate = data.ethereum?.usd
        if (typeof rate === 'number' && rate > 0) setEthToUsdRate(rate)
      })
      .catch(() => { /* ignore */ })
    return () => { cancelled = true }
  }, [])

  // Auto-fill Piece Number from chain: next number = totalSupply + 1 (when contract available or user cleared the field)
  useEffect(() => {
    if (!contract || nftMeta.pieceNumber !== '') return
    let cancelled = false
    contract.totalSupply()
      .then((supply: { toString: () => string }) => {
        if (cancelled) return
        const count = Number(supply.toString()) || 0
        setNftMeta(prev => (prev.pieceNumber === '' ? { ...prev, pieceNumber: String(count + 1) } : prev))
      })
      .catch(() => { /* ignore: chain not connected or read failed */ })
    return () => { cancelled = true }
  }, [contract, nftMeta.pieceNumber])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNftMeta(prev => {
      const next = { ...prev, [name]: value }
      // When user changes Mint Price (ETH), convert and show USD Equivalent
      if (name === 'mintPriceEth' && ethToUsdRate != null) {
        const eth = parseFloat(value)
        if (!isNaN(eth) && eth >= 0) {
          next.usdEquivalent = (eth * ethToUsdRate).toFixed(2)
        }
      }
      return next
    })
  }

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNftMeta(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.trait_type === name ? { ...attr, value } : attr
      ),
    }));
  }

  const getAttr = (traitType: string) =>
    nftMeta.attributes.find(a => a.trait_type === traitType)?.value ?? ''

  const handlePerkToggle = (perk: string) => {
    setNftMeta(prev => ({
      ...prev,
      communityPerks: prev.communityPerks.includes(perk)
        ? prev.communityPerks.filter(p => p !== perk)
        : [...prev.communityPerks, perk],
    }));
  }

  const processImageFile = async (file: File) => {
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
      await axios.post("/api/verify-image", {
        address: account,
        signature: signedData,
        bytes,
        contentType: file.type || "image/jpeg",
        filename: file.name.replace(/\.[^/.]+$/, "") || "image",
      }, { withCredentials: true });
      toast.update(toastId, {
        render: "Image uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || "Failed to upload image";
      console.error("Failed to upload image:", error);
      toast.update(toastId, {
        render: `Image upload failed: ${msg}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
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

  const buildNftPayload = (meta: FormNftMeta, imageUrl: string): Record<string, unknown> => {
    const payload: Record<string, unknown> = {
      name: meta.name,
      description: meta.description,
      image: imageUrl,
      attributes: meta.attributes,
    };
    if (meta.collectionName) payload.collectionName = meta.collectionName;
    if (meta.collectionYear) payload.collectionYear = meta.collectionYear;
    if (meta.pieceNumber) payload.pieceNumber = meta.pieceNumber;
    payload.totalPiecesInCollection = meta.totalPiecesInCollection || '10000';
    if (meta.originLocation) payload.originLocation = meta.originLocation;
    if (meta.historicalPeriod) payload.historicalPeriod = meta.historicalPeriod;
    if (meta.artifactType) payload.artifactType = meta.artifactType;
    if (meta.mintPriceEth) payload.mintPriceEth = meta.mintPriceEth;
    if (meta.usdEquivalent) payload.usdEquivalent = meta.usdEquivalent;
    if (meta.communityPerks?.length) payload.communityPerks = meta.communityPerks;
    if (meta.sourceReference) payload.sourceReference = meta.sourceReference;
    payload.disclaimer = HERITAGE_DISCLAIMER;
    return payload;
  };

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
      const imageUrl = await imageToUrl(nftMeta.image);
      const nft = buildNftPayload(nftMeta, imageUrl);

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

      const nft = buildNftPayload(nftMeta, imageUrl);

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
        if (nftMeta.mintPriceEth) setPrice(nftMeta.mintPriceEth);
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

      const keys = Object.keys(content);
      for (const key of REQUIRED_METADATA_KEYS) {
        if (!keys.includes(key)) throw new Error(`Invalid metadata: missing "${key}"`);
      }
      for (const key of keys) {
        if (!ALLOWED_FIELDS.includes(key)) throw new Error(`Invalid metadata: unknown field "${key}"`);
      }

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

  const inputClass =
    'w-full px-4 py-3 border border-secondarybrown/30 bg-primary focus:outline-none focus:ring-2 focus:ring-secondarybrown/40 focus:border-secondarybrown placeholder:text-lightbrown/70 text-blackbrown transition-all duration-200'
  const selectClass = inputClass + ' pr-10 appearance-none cursor-pointer'
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full max-w-full min-h-0">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <header className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-blackbrown tracking-tight">Create your heritage NFT</h2>
          <p className="mt-2 text-lightbrown text-sm sm:text-base max-w-xl">Fill in the details below, then upload metadata and list on chain.</p>
          <div className="mt-4 h-px bg-secondarybrown/30" />
        </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Basic info" icon={FiType}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blackbrown mb-1.5">NFT Name</label>
            <div className="relative">
              <FiType className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              <input
                value={nftMeta.name}
                type="text"
                id="name"
                name="name"
                onChange={handleInputChange}
                required
                className={inputClass + ' pl-9'}
                placeholder="Enter NFT name"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Collection" icon={FiLayers}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="collectionName" className="block text-sm font-medium text-blackbrown mb-1.5">Collection Name</label>
              <input value={nftMeta.collectionName} type="text" id="collectionName" name="collectionName" onChange={handleInputChange} className={inputClass} placeholder="e.g. Temple Art 2024" />
            </div>
            <div>
              <label htmlFor="collectionYear" className="block text-sm font-medium text-blackbrown mb-1.5">Collection Year</label>
              <input value={nftMeta.collectionYear} type="text" id="collectionYear" name="collectionYear" onChange={handleInputChange} className={inputClass} placeholder="e.g. 2024" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pieceNumber" className="block text-sm font-medium text-blackbrown mb-1.5">Piece Number <span className="text-lightbrown font-normal">(auto: next on chain)</span></label>
              <input value={nftMeta.pieceNumber} type="text" id="pieceNumber" name="pieceNumber" onChange={handleInputChange} className={inputClass} placeholder="Filled from chain when available" />
            </div>
            <div>
              <label htmlFor="totalPiecesInCollection" className="block text-sm font-medium text-blackbrown mb-1.5">Total Pieces in Collection <span className="text-lightbrown font-normal">(fixed)</span></label>
              <input value={nftMeta.totalPiecesInCollection || '10000'} type="text" id="totalPiecesInCollection" name="totalPiecesInCollection" readOnly className={inputClass + ' bg-secondarybrown/10 cursor-not-allowed'} tabIndex={-1} aria-label="Total pieces in collection: 10000" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Origin & period" icon={FiMapPin}>
          <div>
            <label htmlFor="originLocation" className="block text-sm font-medium text-blackbrown mb-1.5">Origin Location</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              <input value={nftMeta.originLocation} type="text" id="originLocation" name="originLocation" onChange={handleInputChange} className={inputClass + ' pl-9'} placeholder="e.g. Kandy, Sri Lanka" />
            </div>
          </div>
          <div>
            <label htmlFor="historicalPeriod" className="block text-sm font-medium text-blackbrown mb-1.5">Historical Period</label>
            <input value={nftMeta.historicalPeriod} type="text" id="historicalPeriod" name="historicalPeriod" onChange={handleInputChange} className={inputClass} placeholder="e.g. Kandyan Era" />
          </div>
          <div>
            <label htmlFor="artifactType" className="block text-sm font-medium text-blackbrown mb-1.5">Artifact Type</label>
            <div className="relative">
              <select id="artifactType" name="artifactType" value={nftMeta.artifactType} onChange={(e) => setNftMeta(prev => ({ ...prev, artifactType: e.target.value }))} className={selectClass}>
                <option value="">Select type</option>
                {ARTIFACT_TYPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Description" icon={FiFileText}>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-blackbrown mb-1.5">Description</label>
            <textarea value={nftMeta.description} id="description" name="description" onChange={handleInputChange} required rows={3} className={inputClass} placeholder="Enter NFT description" />
          </div>
        </SectionCard>

        <SectionCard title="Image" icon={FiImage} fullWidth>
          <div>
            <label className="block text-sm font-medium text-blackbrown mb-1.5">Upload image <span className="text-lightbrown font-normal">(optional)</span></label>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {!(imagePreviewUrl || (typeof nftMeta.image === 'string' && nftMeta.image)) ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                onDragLeave={() => setIsDraggingImage(false)}
                onDrop={handleImageDrop}
                className={`w-full flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed transition-all duration-200 ${isDraggingImage ? 'border-secondarybrown bg-secondarybrown/10 scale-[1.01]' : 'border-secondarybrown/30 hover:border-secondarybrown/50 hover:bg-secondarybrown/5'}`}
              >
                <span className="flex h-14 w-14 items-center justify-center bg-secondarybrown/15">
                  <FiUpload className="w-7 h-7 text-secondarybrown" />
                </span>
                <span className="text-sm font-medium text-blackbrown">Drag & drop image here or click to upload</span>
                <span className="text-xs text-lightbrown">PNG, JPG or WebP</span>
              </button>
            ) : (
              <div className="relative inline-block overflow-hidden border border-secondarybrown/20 bg-primary p-3">
                <img
                  src={imagePreviewUrl || (nftMeta.image as string)}
                  alt="Preview"
                  className="max-h-52 w-auto border border-secondarybrown/20 object-contain"
                />
                <p className="mt-2 text-sm text-lightbrown">{nftMeta.image && typeof nftMeta.image !== 'string' ? nftMeta.image.name : 'Image'}</p>
                <button
                  type="button"
                  onClick={clearImage}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-darkbrown hover:text-blackbrown transition-colors"
                >
                  <FiX className="w-4 h-4" /> Remove image
                </button>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Community Utility & Perks" icon={FiCheckSquare} fullWidth>
          <p className="text-sm text-lightbrown mb-4">Select all perks this NFT grants. These appear on the NFT card.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMUNITY_PERKS_OPTIONS.map((perk) => (
              <label key={perk} className="flex items-center gap-3 cursor-pointer p-3 border border-secondarybrown/20 bg-primary hover:border-secondarybrown/40 transition-all duration-200 has-[:checked]:border-secondarybrown/50 has-[:checked]:bg-secondarybrown/10">
                <input type="checkbox" checked={nftMeta.communityPerks.includes(perk)} onChange={() => handlePerkToggle(perk)} className="h-4 w-4 border-secondarybrown/40 accent-secondarybrown text-secondarybrown focus:ring-2 focus:ring-secondarybrown/40" />
                <span className="text-sm font-medium text-blackbrown">{perk}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Source Reference" icon={FiBook}>
          <div>
            <label htmlFor="sourceReference" className="block text-sm font-medium text-blackbrown mb-1.5">Source Reference / Citation</label>
            <div className="relative">
              <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              <input value={nftMeta.sourceReference} type="text" id="sourceReference" name="sourceReference" onChange={handleInputChange} className={inputClass + ' pl-9'} placeholder="e.g. Museum catalog, publication" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Important notice" icon={FiInfo}>
          <p className="text-sm text-darkbrown bg-secondarybrown/10 border border-secondarybrown/30 p-4 leading-relaxed">{HERITAGE_DISCLAIMER}</p>
        </SectionCard>

        <SectionCard title="Membership & Access" icon={FiUser} fullWidth>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="membershipLevel" className="block text-sm font-medium text-blackbrown mb-1.5">Membership Level</label>
              <div className="relative">
                <select id="membershipLevel" name="membershipLevel" value={getAttr('membershipLevel')} onChange={handleAttributeChange} required className={selectClass}>
                  <option value="">Select level</option>
                  {MEMBERSHIP_LEVEL_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="accessLevel" className="block text-sm font-medium text-blackbrown mb-1.5">Access Level</label>
              <div className="relative">
                <select id="accessLevel" name="accessLevel" value={getAttr('accessLevel')} onChange={handleAttributeChange} required className={selectClass}>
                  <option value="">Select level</option>
                  {ACCESS_LEVEL_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="resourceUnlockScore" className="block text-sm font-medium text-blackbrown mb-1.5">Resource Unlock Score</label>
              <div className="relative">
                <select id="resourceUnlockScore" name="resourceUnlockScore" value={getAttr('resourceUnlockScore')} onChange={handleAttributeChange} required className={selectClass}>
                  <option value="">Select score</option>
                  {RESOURCE_UNLOCK_SCORE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightbrown pointer-events-none" />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="lg:col-span-2 bg-primary border border-secondarybrown/20 p-6 sm:p-7">
          <button
            type="button"
            onClick={uploadMetadata}
            disabled={submitting}
            className="w-full py-3.5 px-5 font-semibold bg-secondarybrown text-primary hover:bg-secondarybrown/90 focus:outline-none focus:ring-2 focus:ring-secondarybrown/50 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? "Uploading…" : "Upload Metadata"}
          </button>
        </div>
      </form>

      {/* Create NFT Section - shows after metadata is uploaded */}
      {nftURI && (
        <div className="mt-10 pt-8 border-t border-secondarybrown/20">
          <div className="bg-primary border border-secondarybrown/20 overflow-hidden">
            <div className="px-6 py-4 bg-secondarybrown/15 border-b border-secondarybrown/20">
              <h3 className="text-lg font-semibold text-blackbrown">List on chain</h3>
              <p className="text-sm text-lightbrown mt-0.5">Set price and mint your NFT</p>
            </div>
            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-blackbrown mb-1.5">Metadata URI</label>
                <input
                  type="text"
                  value={nftURI}
                  readOnly
                  className="w-full px-4 py-3 border border-secondarybrown/30 bg-primary text-blackbrown text-sm"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-blackbrown mb-1.5">Price (ETH)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className={inputClass}
                  placeholder="0.1"
                />
              </div>
              <button
                onClick={createNft}
                type="button"
                disabled={!price || parseFloat(price) <= 0}
                className="w-full py-3.5 px-5 font-semibold bg-darkbrown text-primary hover:bg-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown/50 focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                List NFT
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default NFTForm

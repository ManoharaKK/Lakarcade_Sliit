import React from 'react'
import { useRouter } from 'next/navigation'

interface CardProps {
  name: string
  description: string
  image: string
  attributes: Array<{ trait_type: string; value: string }>
  price?: string
  tokenId?: number
  priceNum?: number
  buyNft?: (tokenId: number, value: number) => Promise<void>
}

function Cards({
  name,
  description,
  image,
  attributes,
  price,
  tokenId,
  priceNum,
  buyNft,
}: CardProps) {
  const canBuy = typeof buyNft === 'function' && tokenId != null && priceNum != null
  const router = useRouter()

  const handlePreview = () => {
    if (tokenId == null) return
    router.push(`/Nft/${tokenId}`)
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white shadow-lg border border-[#F6E7CA]">
      <div className="flex-shrink-0">
        <img
          className="h-full w-full object-cover"
          src={image}
          alt={name}
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#693422] uppercase tracking-wide">Creatures NFT</p>
          <div className="block mt-2">
            <p className="text-lg font-semibold text-[#290E0A]">{name}</p>
            <p className="mt-2 mb-3 text-sm text-[#4B2B23] leading-relaxed line-clamp-3">{description}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex flex-col px-4 pt-4">
            <span className="text-xs font-medium text-[#8C5A3B]">Price</span>
            <span className="text-xl font-extrabold text-[#290E0A]">
              {price ?? 'N/A'}
              {price && ' ETH'}
            </span>
          </div>
        </div>
        <div>
          {canBuy && (
            <button
              onClick={() => buyNft!(tokenId!, priceNum!)}
              type="button"
              className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium shadow-sm text-[#F6E7CA] bg-[#693422] hover:bg-[#55271B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6E7CA]/60"
            >
              Buy
            </button>
          )}
          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center px-4 py-2 border border-[#693422] shadow-sm text-base font-medium text-[#693422] bg-[#F6E7CA] hover:bg-[#F2D7A5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6E7CA]/60"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cards
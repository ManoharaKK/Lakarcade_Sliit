'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useListedNfts } from '@/components/hooks/web3'
import { Nft } from '@_types/nft'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function Mint() {
  const { nfts } = useListedNfts()
  const buyNft = nfts.buyNft

  const listedHeritageNfts = useMemo(() => {
    if (!nfts.data) return []
    return nfts.data
      .filter((item: Nft) => item.meta?.nftType !== 'product')
      .filter((item: Nft) => {
        const name = (item.meta?.name || '').toLowerCase()
        const desc = (item.meta?.description || '').toLowerCase()
        return !(
          name.includes('kavinda') ||
          name.includes('manohara') ||
          desc.includes('kavinda') ||
          desc.includes('manohara')
        )
      })
  }, [nfts.data])

  const [currentIndex, setCurrentIndex] = useState(0)
  const total = listedHeritageNfts.length
  const currentNft = total > 0 ? listedHeritageNfts[currentIndex] : null

  // Keep index in range when list changes
  useEffect(() => {
    if (total === 0) return
    setCurrentIndex((i) => Math.min(i, total - 1))
  }, [total])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? total - 1 : i - 1))
  }, [total])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= total - 1 ? 0 : i + 1))
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [total, goPrev, goNext])

  if (nfts.isLoading) {
    return (
      <div className="bg-[#EADABC] py-12 mt-12">
        <div className="containerpadding container mx-auto px-4">
          <h1 className="title text-blackbrown mb-8">Mint Your NFT</h1>
          <p className="text-blackbrown/80">Loading NFTs from marketplace...</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square max-w-lg bg-blackbrown/10 animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-blackbrown/10 rounded w-3/4" />
              <div className="h-4 bg-blackbrown/10 rounded w-full" />
              <div className="h-4 bg-blackbrown/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (listedHeritageNfts.length === 0) {
    return (
      <div className="bg-[#EADABC] py-12 mt-12">
        <div className="containerpadding container mx-auto px-4 text-center py-12">
          <h1 className="title text-blackbrown">Mint Your NFT</h1>
          <p className="description text-blackbrown mt-6 max-w-xl mx-auto">
            No heritage NFTs are listed for sale right now. Check back later or browse the collection.
          </p>
          <Link
            href="/NftHandycraft"
            className="inline-block mt-6 bg-secondarybrown text-primary py-3 px-8 rounded hover:bg-secondarybrown/90 transition-colors font-semibold"
          >
            Browse NftHandycraft
          </Link>
        </div>
      </div>
    )
  }

  const meta = currentNft!.meta!
  const imageSrc = meta.image || '/images/placeholder.png'
  const priceEth = currentNft!.price != null ? Number(currentNft!.price).toFixed(4) : '—'

  return (
    <div className="bg-[#EADABC] py-12 mt-12">
      <div className="containerpadding container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="title text-blackbrown">Mint Your NFT</h1>
          <Link
            href="/NftHandycraft"
            className="text-secondarybrown hover:underline font-semibold text-sm sm:text-base"
          >
            View full collection on NftHandycraft →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: image with arrow controls */}
          <div className="relative flex items-center gap-2">
            {total > 1 && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous NFT"
                className="absolute left-0 z-10 p-2 rounded-full bg-blackbrown/80 text-primary hover:bg-blackbrown transition-colors shadow-lg -translate-x-2 md:static md:translate-x-0 shrink-0"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex-1 border border-secondarybrown p-4 bg-white/50 rounded overflow-hidden">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image
                  key={currentNft!.tokenId}
                  src={imageSrc}
                  alt={meta.name || `NFT #${currentNft!.tokenId}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={imageSrc.startsWith('ipfs://') || imageSrc.startsWith('http')}
                />
              </div>
            </div>
            {total > 1 && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next NFT"
                className="absolute right-0 z-10 p-2 rounded-full bg-blackbrown/80 text-primary hover:bg-blackbrown transition-colors shadow-lg translate-x-2 md:static md:translate-x-0 shrink-0"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Right: content */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold text-[#693422] uppercase tracking-wide">Creatures NFT</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-blackbrown">{meta.name}</h2>
            <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              <p className="description text-blackbrown">{meta.description}</p>
            </div>
            {meta.attributes?.length ? (
              <div className="flex flex-wrap gap-2">
                {meta.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded border border-[#693422]/40 bg-white/60 text-sm text-blackbrown"
                  >
                    {String(attr.trait_type)}: {attr.value}
                  </span>
                ))}
              </div>
            ) : null}
            <div>
              <span className="text-xs font-medium text-[#8C5A3B]">Price</span>
              <p className="text-xl font-extrabold text-blackbrown">{priceEth} ETH</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {buyNft && (
                <button
                  type="button"
                  onClick={() => buyNft(currentNft!.tokenId, Number(currentNft!.price))}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium shadow-sm text-[#F6E7CA] bg-[#693422] hover:bg-[#55271B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6E7CA]/60 rounded"
                >
                  Buy
                </button>
              )}
              <Link
                href={`/Nft/${currentNft!.tokenId}`}
                className="inline-flex items-center px-4 py-2 border border-[#693422] shadow-sm text-base font-medium text-[#693422] bg-[#F6E7CA] hover:bg-[#F2D7A5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6E7CA]/60 rounded"
              >
                Preview
              </Link>
            </div>
            {total > 1 && (
              <p className="text-blackbrown/70 text-sm">
                Use ← → arrow keys or the buttons to switch. NFT {currentIndex + 1} of {total}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mint

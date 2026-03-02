'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar/navbar'
import { useListedNfts } from '@/components/hooks/web3'
import { Nft } from '@_types/nft'

function NftDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const tokenIdParam = params?.tokenId
  const tokenId = typeof tokenIdParam === 'string' ? Number(tokenIdParam) : Number(tokenIdParam?.[0])

  const { nfts } = useListedNfts()
  const buyNft = nfts.buyNft

  const nft: Nft | undefined =
    nfts.data?.find((item: Nft) => item.tokenId === tokenId)

  if (nfts.isLoading) {
    return (
      <div>
        <Navbar />
        <div className="containerpadding container mx-auto pt-32 text-center text-white">
          Loading NFT details...
        </div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div>
        <Navbar />
        <div className="containerpadding container mx-auto pt-32 text-center text-white">
          NFT not found.
        </div>
      </div>
    )
  }

  const { meta } = nft

  return (
    <div className="min-h-screen flex flex-col bg-[#290E0A] text-[#F6E7CA]">
      <Navbar />
      <div className="containerpadding container mx-auto flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-10 mt-[100px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center text-xs sm:text-sm font-medium text-[#F6E7CA]/80 hover:text-[#F6E7CA] transition-colors"
        >
          ← Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 rounded-3xl border border-[#F6E7CA]/15 bg-[#3B241C] shadow-2xl p-6 sm:p-10">
          <div className="flex justify-center">
            <img
              src={meta.image || '/images/placeholder.png'}
              alt={meta.name}
              className="max-h-[480px] w-auto rounded-2xl border border-[#F6E7CA]/20 object-contain shadow-xl bg-[#4B2B23]"
            />
          </div>
          <div className="space-y-8 max-h-[520px] lg:max-h-[560px] overflow-y-auto pr-1">
            <div>
              <p className="text-xs font-semibold text-[#F2C14F] mb-1 uppercase tracking-wide">Creatures NFT</p>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#F6E7CA]">{meta.name}</h1>
              <div className="max-h-40 sm:max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                <p className="text-sm sm:text-base text-[#F6E7CA]/90 leading-relaxed">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-100">Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {meta.collectionName && (
                  <div>
                    <dt className="text-slate-400">Collection</dt>
                    <dd className="font-semibold text-slate-100">{meta.collectionName}</dd>
                  </div>
                )}
                {meta.collectionYear && (
                  <div>
                    <dt className="text-slate-400">Year</dt>
                    <dd className="font-semibold text-slate-100">{meta.collectionYear}</dd>
                  </div>
                )}
                {meta.pieceNumber && (
                  <div>
                    <dt className="text-slate-400">Piece #</dt>
                    <dd className="font-semibold text-slate-100">{meta.pieceNumber}</dd>
                  </div>
                )}
                {meta.totalPiecesInCollection && (
                  <div>
                    <dt className="text-slate-400">Total in collection</dt>
                    <dd className="font-semibold text-slate-100">{meta.totalPiecesInCollection}</dd>
                  </div>
                )}
                {meta.originLocation && (
                  <div>
                    <dt className="text-slate-400">Origin</dt>
                    <dd className="font-semibold text-slate-100">{meta.originLocation}</dd>
                  </div>
                )}
                {meta.historicalPeriod && (
                  <div>
                    <dt className="text-slate-400">Historical period</dt>
                    <dd className="font-semibold text-slate-100">{meta.historicalPeriod}</dd>
                  </div>
                )}
                {meta.artifactType && (
                  <div>
                    <dt className="text-slate-400">Artifact type</dt>
                    <dd className="font-semibold text-slate-100">{meta.artifactType}</dd>
                  </div>
                )}
                {meta.nftType && (
                  <div>
                    <dt className="text-slate-400">NFT type</dt>
                    <dd className="font-semibold capitalize text-slate-100">{meta.nftType}</dd>
                  </div>
                )}
              </dl>
            </div>

            {meta.attributes?.length ? (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-slate-100">Attributes</h2>
                <div className="flex flex-wrap gap-3">
                  {meta.attributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-md border border-indigo-400/30 bg-slate-900/60 shadow-sm"
                    >
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        {attr.trait_type}
                      </div>
                      <div className="text-sm font-semibold text-slate-50">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#F6E7CA]">Price</h2>
              <p className="text-2xl font-bold text-[#F2C14F]">
                {nft.price} ETH
              </p>
              {buyNft && (
                <button
                  type="button"
                  onClick={() => buyNft(nft.tokenId, nft.price)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-[#290E0A] bg-[#F6E7CA] hover:bg-[#F2D7A5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6E7CA]/80"
                >
                  Buy this NFT
                </button>
              )}
            </div>

            {meta.sourceReference && (
              <div className="pt-3 border-t border-[#F6E7CA]/15">
                <h2 className="text-xs font-semibold text-[#F6E7CA]/70 uppercase tracking-wide">Source reference</h2>
                <p className="text-sm text-[#F6E7CA]/90 mt-1">{meta.sourceReference}</p>
              </div>
            )}

            {meta.disclaimer && (
              <div className="pt-3 border-t border-[#F6E7CA]/15">
                <h2 className="text-xs font-semibold text-[#F6E7CA]/70 uppercase tracking-wide">Disclaimer</h2>
                <p className="text-[11px] text-[#F6E7CA]/80 mt-1 leading-relaxed">{meta.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-[#693422] text-[#F6E7CA] py-6 mt-auto">
        <div className="containerpadding container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} LAKARCADE Handicraft NFT Market</p>
          <p className="text-[#F6E7CA]/80">Preserving Sri Lankan cultural heritage on-chain.</p>
        </div>
      </footer>
    </div>
  )
}

export default function NftDetailPage() {
  return <NftDetailPageContent />
}


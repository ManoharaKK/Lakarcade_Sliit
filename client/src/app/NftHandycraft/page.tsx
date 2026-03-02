'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar/navbar'
import Cards from '@/components/NFT/cards'
import PerksDetails from '@/components/NFT/PerksDetails'
import { useListedNfts } from '@/components/hooks/web3'
import { Nft } from '@_types/nft'
import {
  MEMBERSHIP_LEVEL_OPTIONS,
  ACCESS_LEVEL_OPTIONS,
  RESOURCE_UNLOCK_SCORE_OPTIONS,
  COMMUNITY_PERKS_OPTIONS,
  type NftAttribute,
  type Trait,
} from '@_types/nft'
import Footer from '@/components/Footer/Footer'
import Section9 from '@/components/Home/Section9'

function getAttr(nft: Nft, traitType: Trait): string | undefined {
  const attr = nft.meta?.attributes?.find((a: NftAttribute) => a.trait_type === traitType)
  return attr?.value
}

function hasCommunityPerk(nft: Nft, perk: string): boolean {
  const perks = nft.meta?.communityPerks || []
  return perks.some((p) => p.toLowerCase() === perk.toLowerCase())
}


function PageContent() {

  const { nfts } = useListedNfts();
  const buyNft = nfts.buyNft;

  const baseNfts = nfts.data
    ? nfts.data
        .filter((item: Nft) => item.meta?.nftType !== 'product')
        .filter((item: Nft) => {
          const name = (item.meta?.name || '').toLowerCase();
          const desc = (item.meta?.description || '').toLowerCase();
          return !(
            name.includes('kavinda') ||
            name.includes('manohara') ||
            desc.includes('kavinda') ||
            desc.includes('manohara')
          );
        })
        .slice(1)
    : [];

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCommunityPerks, setFilterCommunityPerks] = useState<string>('')
  const [filterMembershipLevel, setFilterMembershipLevel] = useState<string>('')
  const [filterAccessLevel, setFilterAccessLevel] = useState<string>('')
  const [filterResourceUnlockScore, setFilterResourceUnlockScore] = useState<string>('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const visibleNfts = useMemo(() => {
    return baseNfts.filter((item: Nft) => {
      const name = (item.meta?.name || '').toLowerCase()
      const desc = (item.meta?.description || '').toLowerCase()
      const q = searchQuery.trim().toLowerCase()
      if (q && !name.includes(q) && !desc.includes(q)) return false
      if (filterMembershipLevel) {
        const val = getAttr(item, 'membershipLevel')
        if (val !== filterMembershipLevel) return false
      }
      if (filterAccessLevel) {
        const val = getAttr(item, 'accessLevel')
        if (val !== filterAccessLevel) return false
      }
      if (filterResourceUnlockScore) {
        const val = getAttr(item, 'resourceUnlockScore')
        if (val !== filterResourceUnlockScore) return false
      }
      if (filterCommunityPerks) {
        if (!hasCommunityPerk(item, filterCommunityPerks)) return false
      }
      return true
    })
  }, [
    baseNfts,
    searchQuery,
    filterCommunityPerks,
    filterMembershipLevel,
    filterAccessLevel,
    filterResourceUnlockScore,
  ])

  const totalPages = Math.max(1, Math.ceil(visibleNfts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const pageNfts = visibleNfts.slice(startIndex, startIndex + pageSize)

  const resetFilters = () => {
    setSearchQuery('')
    setFilterCommunityPerks('')
    setFilterMembershipLevel('')
    setFilterAccessLevel('')
    setFilterResourceUnlockScore('')
    setPage(1)
  }

  // Debug: Log the data structure
  console.log("NFTs data:", nfts.data);
  console.log("NFTs isLoading:", nfts.isLoading);
  console.log("NFTs error:", nfts.error);

  return (
    <div>
      <Navbar />
      <div className="containerpadding container mx-auto relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8 mt-[200px]">
        <div className="relative">
          {/* Hero title – always shown (loading, with NFTs, or no NFTs) */}
          <section className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blackbrown uppercase">
              Sigiri Bithusithuwam Heritage NFTs
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-[#290E0A]/90">
              Discover and collect unique cultural heritage NFTs. Each piece represents a part of Sri Lankan heritage with real utility, membership perks, and exclusive access.
            </p>
          </section>

          {nfts.isLoading ? (
            <div className="mt-6 text-center">
              <p className="text-white text-lg">Loading NFTs...</p>
            </div>
          ) : visibleNfts && visibleNfts.length > 0 ? (
            <>
              {/* Hero section: NFT image mosaic – hover shows NFT data */}
              <section className="mb-12">
                <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 grid-rows-3 sm:grid-rows-6 lg:grid-rows-9 gap-1">
                  {visibleNfts
                    .slice(0, 108)
                    .map((item: Nft, index: number) => (
                      <Link
                        key={item.tokenId || index}
                        href={`/Nft/${item.tokenId}`}
                        className="group relative block w-full h-16 sm:h-20 lg:h-24 overflow-hidden rounded-md border border-white/10 bg-black/40"
                      >
                        <img
                          src={item.meta?.image || '/images/placeholder.png'}
                          alt={item.meta?.name || `NFT #${item.tokenId}`}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-200"
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-0.5 p-1.5 pointer-events-none">
                          <p className="text-white font-semibold text-[10px] sm:text-xs text-center line-clamp-2">
                            {item.meta?.name || `NFT #${item.tokenId}`}
                          </p>
                          <p className="text-[#F6E7CA] text-[9px] sm:text-[10px] font-medium">
                            {item.price != null ? `${Number(item.price).toFixed(4)} ETH` : '—'}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>

              {/* Title + NFT cards section */}
              <section>
                <div className="text-center">
                  <h2 className="text-3xl tracking-tight font-extrabold text-blackbrown sm:text-4xl">
                    Amazing Creatures NFTs
                  </h2>
                  <p className="mt-3 max-w-2xl mx-auto text-xl text-[#290E0A] sm:mt-4">
                    Mint an NFT to get unlimited ownership forever!
                  </p>
                </div>

                {/* Filters and search */}
                <div className="mt-8 p-4 border border-lightbrown bg-[#F6E7CA]/15">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <label className="sr-only" htmlFor="nft-search">Search by name</label>
                    <input
                      id="nft-search"
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setPage(1)
                      }}
                      className="flex-1 min-w-[160px] max-w-xs px-3 py-2 text-sm border border-lightbrown bg-white/90 text-blackbrown placeholder:text-blackbrown/50 focus:outline-none focus:ring-2 focus:ring-[#693422]/50"
                    />
                    <select
                      aria-label="Community Utility & Perks"
                      value={filterCommunityPerks}
                      onChange={(e) => {
                        setFilterCommunityPerks(e.target.value)
                        setPage(1)
                      }}
                      className="pl-3 pr-9 py-2 text-sm border border-lightbrown bg-white/90 text-blackbrown focus:outline-none focus:ring-2 focus:ring-[#693422]/50"
                    >
                      <option value="">Community Utility & Perks</option>
                      {COMMUNITY_PERKS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Membership Level"
                      value={filterMembershipLevel}
                      onChange={(e) => {
                        setFilterMembershipLevel(e.target.value)
                        setPage(1)
                      }}
                      className="pl-3 pr-9 py-2 text-sm border border-lightbrown bg-white/90 text-blackbrown focus:outline-none focus:ring-2 focus:ring-[#693422]/50"
                    >
                      <option value="">Membership Level</option>
                      {MEMBERSHIP_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Access Level"
                      value={filterAccessLevel}
                      onChange={(e) => {
                        setFilterAccessLevel(e.target.value)
                        setPage(1)
                      }}
                      className="pl-3 pr-9 py-2 text-sm border border-lightbrown bg-white/90 text-blackbrown focus:outline-none focus:ring-2 focus:ring-[#693422]/50"
                    >
                      <option value="">Access Level</option>
                      {ACCESS_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Resource Unlock Score"
                      value={filterResourceUnlockScore}
                      onChange={(e) => {
                        setFilterResourceUnlockScore(e.target.value)
                        setPage(1)
                      }}
                      className="pl-3 pr-9 py-2 text-sm border border-lightbrown bg-white/90 text-blackbrown focus:outline-none focus:ring-2 focus:ring-[#693422]/50"
                    >
                      <option value="">Resource Unlock Score</option>
                      {RESOURCE_UNLOCK_SCORE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-3 py-2 text-sm bg-[#693422] text-[#F6E7CA] border border-lightbrown hover:bg-[#4B2B23] transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-blackbrown/70">
                    Showing {visibleNfts.length} NFT{visibleNfts.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="mt-8 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {pageNfts.map((item: Nft, index: number) => {
                    // Debug each item
                    console.log("NFT item:", item);

                    return (
                      <div key={item.tokenId || index}>
                        <Cards
                          name={item.meta?.name || `NFT #${item.tokenId}`}
                          description={item.meta?.description || `A unique creature NFT`}
                          image={item.meta?.image || '/images/placeholder.png'}
                          attributes={item.meta?.attributes || []}
                          price={item.price?.toFixed(4)}
                          tokenId={item.tokenId}
                          priceNum={item.price}
                          buyNft={buyNft}
                        />
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[#F6E7CA]">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 bg-[#693422] text-[#F6E7CA] border border-[#F6E7CA]/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4B2B23] transition-colors"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1 rounded-md bg-[#290E0A]/80 border border-[#F6E7CA]/30">
                      Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 bg-[#693422] text-[#F6E7CA] border border-[#F6E7CA]/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4B2B23] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>

              <PerksDetails />
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-blackbrown text-lg font-medium">No NFTs listed for sale</p>
              <p className="text-blackbrown/70 text-sm mt-2">Check back later for new listings.</p>
            </div>
          )}
        </div>
      </div>
      <Section9 />
      <Footer />
    </div>
  )
}

export default function page() {
  return <PageContent />
}


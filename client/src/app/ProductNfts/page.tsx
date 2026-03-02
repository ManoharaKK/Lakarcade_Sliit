'use client'

import React from 'react'
import Navbar from '@/components/Navbar/navbar'
import Cards from '@/components/NFT/cards'
import { useListedNfts } from '@/components/hooks/web3'
import { Nft } from '@_types/nft'

function PageContent() {
  const { nfts } = useListedNfts()
  const buyNft = nfts.buyNft
  const productNfts = nfts.data ? nfts.data.filter((item: Nft) => item.meta?.nftType === 'product') : []

  return (
    <div>
      <Navbar />
      <div className="containerpadding container mx-auto relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8 mt-[200px]">
        <div className="relative">
          {nfts.isLoading ? (
            <div className="mt-12 text-center">
              <p className="text-white text-lg">Loading NFTs...</p>
            </div>
          ) : productNfts && productNfts.length > 0 ? (
            <>
             

              <section>
                <div className="text-center">
                  <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl">
                    Product NFTs
                  </h2>
                  <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:mt-4">
                    Browse and buy product NFTs from our marketplace.
                  </p>
                </div>

                <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {productNfts.map((item: Nft, index: number) => (
                    <div key={item.tokenId || index}>
                      <Cards
                        name={item.meta?.name || `NFT #${item.tokenId}`}
                        description={item.meta?.description || `Product NFT`}
                        image={item.meta?.image || '/images/placeholder.png'}
                        attributes={item.meta?.attributes || []}
                        price={item.price?.toFixed(4)}
                        tokenId={item.tokenId}
                        priceNum={item.price}
                        buyNft={buyNft}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-white text-lg">No product NFTs listed yet</p>
              <p className="text-gray-400 text-sm mt-2">Check back later or create one from the form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductNftsPage() {
  return <PageContent />
}

'use client'

import React from 'react'
import Navbar from '@/components/Navbar/navbar'
import Cards from '@/components/NFT/cards'
import { useListedNfts } from '@/components/hooks/web3'
import { Nft } from '@_types/nft'


function PageContent() {
  
  const { nfts } = useListedNfts();
  const buyNft = nfts.buyNft;
  
  // Debug: Log the data structure
  console.log("NFTs data:", nfts.data);
  console.log("NFTs isLoading:", nfts.isLoading);
  console.log("NFTs error:", nfts.error);

  return (
    <div>
      <Navbar />
      <div className="containerpadding container mx-auto relative  pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8 mt-[200px]">
        <div className="absolute inset-0">
          <div className="h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>

          {nfts.isLoading ? (
            <div className="mt-12 text-center">
              <p className="text-white text-lg">Loading NFTs...</p>
            </div>
          ) : nfts.data && nfts.data.length > 0 ? (
            <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nfts.data.map((item: Nft, index: number) => {
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
          ) : (
            <div className="mt-12 text-center">
              <p className="text-white text-lg">No NFTs listed for sale</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new listings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function page() {
  return <PageContent />
}


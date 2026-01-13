'use client'
import React, { useState } from 'react'
import Image from 'next/image'

function Mint() {
  const [quantity, setQuantity] = useState(1)
  const maxQuantity = 10

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className='bg-[#EADABC] py-12 mt-12   '>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mx-12 justify-center items-center'>
            <div className='col-span-1 border border-secondarybrown  p-4'>
                <Image src='/images/NFT/Nft.png' alt='Mint' width={500} height={500} />
            </div>
            <div className='col-span-1'>
                <h1 className='title text-blackbrown'>
                    Mint Your NFT
                </h1>
                <p className='description text-blackbrown mt-6'>
                Own a piece of Sri Lanka's cultural legacy! This one-of-a-kind handcrafted Kandyan Lion Mask comes with its digital twin NFT on the blockchain. Mint your share today and become a co-owner of this rare artifact.
                </p>
                <p className='description text-blackbrown mt-4'>
                Own a piece of Sri Lanka's culture! This unique handcrafted Kandyan Lion Mask is available as 10 NFT shares, each giving you verified co-ownership on the blockchain. Mint now to support the artisan, preserve heritage, and potentially benefit from future appreciation. Includes artisan story, creation videos, and digital provenance.                </p>
                <h1 className='title text-blackbrown mt-8'>
                    1/10 000
                </h1>
                <p className='text-blackbrown '>
                    Mint price <span className='text-secondarybrown'>0.035 ETH</span>
                </p>
                <div className='flex items-center gap-4 mt-6'>
                    <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className='bg-secondarybrown text-primary w-10 h-10 flex items-center justify-center hover:bg-secondarybrown/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        -
                    </button>
                    <span className='text-blackbrown text-xl font-semibold min-w-[40px] text-center'>
                        {quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        disabled={quantity >= maxQuantity}
                        className='bg-secondarybrown text-primary w-10 h-10 flex items-center justify-center hover:bg-secondarybrown/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        +
                    </button>
                    <button className='bg-secondarybrown text-primary py-3 px-8 hover:bg-secondarybrown/90 transition-colors font-semibold ml-4'>
                        Mint Now
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Mint
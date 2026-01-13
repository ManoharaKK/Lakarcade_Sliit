import React from 'react'
import Image from 'next/image'
function AboutNft() {
    return (
        <div className='mt-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 justify-center items-center'>
                <div>
                    <Image src='/images/NFT/About.png' alt='About Nft' width={500} height={500} />

                </div>
                <div className='col-span-2'>
                    <h1 className='title text-blackbrown'>
                        About the Concept
                    </h1>
                    <p className='description text-blackbrown mt-6'>
                        We introduce a new way to invest in Sri Lankan handicrafts. Instead of a single buyer owning the entire product, one physical artifact is divided into multiple NFT shares. Each NFT represents a fraction of ownership, allowing many investors to participate.
                    </p>
                    <h1 className='title text-blackbrown mt-8'>
                        How It Works
                    </h1>
                    <ul className='description text-blackbrown mt-6 list-disc pl-6 space-y-2'>
                        <li>A rare handicraft (e.g., Kandyan mask) is launched with 100 NFTs representing shares.</li>
                        <li>Investors can buy one or multiple NFTs at the starting price.</li>
                        <li>As demand grows, NFT prices increase on the secondary market.</li>
                        <li>Investors resell their shares for profit, while artisans receive lifetime royalties.</li>
                    </ul>
                </div>

            </div>
            <h1 className='title text-blackbrown mt-12 mb-12'>
                Why This Matters
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-2 justify-center items-center'>
                <div className='border border-lightbrown px-4 py-8 hover:bg-lightbrown transition-colors duration-300 cursor-pointer'>
                    <h1 className='font-bold text-blackbrown'>
                        ACCESSIBILITY
                    </h1>
                    <p className='description text-blackbrown mt-6'>
                        Even small investors can co-own a high-value artifact.
                    </p>
                </div>
                <div className='border border-lightbrown px-4 py-8 hover:bg-lightbrown transition-colors duration-300 cursor-pointer'>
                    <h1 className='font-bold text-blackbrown'>
                        ACCESSIBILITY
                    </h1>
                    <p className='description text-blackbrown mt-6'>
                        Even small investors can co-own a high-value artifact.
                    </p>
                </div>
                <div className='border border-lightbrown px-4 py-8 hover:bg-lightbrown transition-colors duration-300 cursor-pointer'>
                    <h1 className='font-bold text-blackbrown'>
                        ACCESSIBILITY
                    </h1>
                    <p className='description text-blackbrown mt-6'>
                        Even small investors can co-own a high-value artifact.
                    </p>
                </div>
                <div className='border border-lightbrown px-4 py-8 hover:bg-lightbrown transition-colors duration-300 cursor-pointer'>
                    <h1 className='font-bold text-blackbrown'>
                        ACCESSIBILITY
                    </h1>
                    <p className='description text-blackbrown mt-6'>
                        Even small investors can co-own a high-value artifact.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default AboutNft
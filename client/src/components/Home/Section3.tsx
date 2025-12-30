import React from 'react'
import Image from 'next/image'
function Section3() {
    return (
        <div className='containerpadding container mx-auto'>

<div className='w-full relative mb-5' style={{ height: 'auto' }}>
                <Image
                    src='/images/Home/Line.svg'
                    alt='section2'
                    width={8914}
                    height={459}
                    className='w-full h-auto mt-5'
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>

            <div className='my-5'>
                <h1 className='text-blackbrown title text-center'>
                    ABOUT LAKARCADE
                </h1>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-7 border-1 border-lightbrown items-stretch '>
                <div className='hidden xl:flex p-2 flex-col h-full min-h-full border-r-0 xl:border-r border-lightbrown'>
                    <div className='border border-lightbrown ' >
                        <Image src='/images/Home/About.svg' alt='section2' width={8914} height={459} className='w-full h-auto' />
                    </div>
                    <div className='flex flex-row justify-between items-stretch flex-1'>
                        <div className='flex items-stretch h-full'>
                            <div className='bg-lightbrown w-[2px] mx-2'>
                            </div>
                            <div className='bg-lightbrown w-[5px] mx-2'>
                            </div>
                        </div>
                        <div className='h-full flex items-center p-2'>
                            <Image src='/images/Home/LAKARCADE.svg' alt='section2' width={8914} height={459} className='w-auto h-full object-contain' />
                        </div>
                    </div>

                </div>
                <div className='col-span-1 xl:col-span-5 border-r-0 xl:border-r border-lightbrown'>
                    <p className='description text-blackbrown text-center py-8 px-4 '>
                        LAKARCADE is one of the biggest novelty Gift & Souvenir shopping emporiums in Asia located in the heart of Colombo, LAKARCADE offers a wide array of authentic Sri Lankan souvenirs and novelty gift items. The fine range on display includes Finest Ceylon teas, spices, carefully selected traditional art & craft items, batiks, gems, jewellery, silverware and many more creative products.
                    </p>
                    <div className='bg-lightbrown w-full h-[1px] mb-4'>
                    </div>
                    <div>
                        <Image src='/images/Home/Video.png' alt='section2' width={8914} height={459} className='w-full h-auto px-2' />
                    </div>
                    <div className='bg-lightbrown w-full h-[1px] mt-4'>
                    </div>
                    <p className='description text-blackbrown text-center py-8 px-4'>
                        LAKARCADE is one of the biggest novelty Gift & Souvenir shopping emporiums in Asia located in the heart of Colombo, LAKARCADE offers a wide array of authentic Sri Lankan souvenirs and novelty gift items. The fine range on display includes Finest Ceylon teas, spices, carefully selected traditional art & craft items, batiks, gems, jewellery, silverware and many more creative products.
                    </p>

                </div>
                <div className='hidden xl:flex flex-col justify-end'>
                    <div className='flex flex-row justify-between items-stretch flex-1'>
                        <div className='h-full flex items-center p-2'>
                            <Image src='/images/Home/LAKARCADE.svg' alt='section2' width={8914} height={459} className='w-auto h-full object-contain' />
                        </div>
                        <div className='flex items-stretch h-full'>
                            <div className='bg-lightbrown w-[2px] mx-2'>
                            </div>
                            <div className='bg-lightbrown w-[5px] mx-2'>
                            </div>
                        </div>

                    </div>
                    <div className='p-2'>
                        <div className='border border-lightbrown'>

                            <Image src='/images/Home/About.svg' alt='section2' width={8914} height={459} className='w-full h-auto' />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Section3
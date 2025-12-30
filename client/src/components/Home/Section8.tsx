import React from 'react'
import Image from 'next/image'
function Section8() {
  return (
    <div className='containerpadding container mx-auto mt-12 sm:mt-14 md:mt-18 lg:mt-20 xl:mt-22 2xl:mt-24'>
        <div>
            <h1 className='text-blackbrown title text-center '>
            Our Memberships
            </h1>
            <div className='w-screen relative left-1/2 -translate-x-1/2 mt-5 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 2xl:mt-15'>
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 justify-center items-center px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-20'>
                    {/* First row: 2 icons on mobile, all 5 on larger screens */}
                    <div className='flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 justify-between items-center'>
                    <Image 
                        src='/images/Home/Icon1.svg' 
                        alt='membership' 
                        width={200} 
                        height={200} 
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 object-contain' 
                    />
                    <Image 
                        src='/images/Home/Icon2.svg' 
                        alt='membership' 
                        width={200} 
                        height={200} 
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 object-contain' 
                    />
                    <Image 
                        src='/images/Home/Icon3.svg' 
                        alt='membership' 
                        width={200} 
                        height={200} 
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 object-contain hidden sm:block' 
                    />
                    <Image 
                        src='/images/Home/Icon4.svg' 
                        alt='membership' 
                        width={200} 
                        height={200} 
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 object-contain hidden sm:block' 
                    />
                    <Image 
                        src='/images/Home/Icon5.svg' 
                        alt='membership' 
                        width={200} 
                        height={200} 
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 object-contain hidden sm:block' 
                    />
                </div>
                    {/* Second row: 3 icons on mobile only */}
                    <div className='flex flex-row gap-2 sm:hidden justify-center items-center'>
                        <Image 
                            src='/images/Home/Icon3.svg' 
                            alt='membership' 
                            width={200} 
                            height={200} 
                            className='w-16 h-16 object-contain' 
                        />
                        <Image 
                            src='/images/Home/Icon4.svg' 
                            alt='membership' 
                            width={200} 
                            height={200} 
                            className='w-16 h-16 object-contain' 
                        />
                        <Image 
                            src='/images/Home/Icon5.svg' 
                            alt='membership' 
                            width={200} 
                            height={200} 
                            className='w-16 h-16 object-contain' 
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full relative mt-5 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 2xl:mt-15' style={{ height: 'auto' }}>
                <Image
                    src='/images/Home/Line.svg'
                    alt='section2'
                    width={8914}
                    height={459}
                    className='w-full h-auto'
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
    </div>
  )
}

export default Section8
import React from 'react'
import Image from 'next/image'

function Section4() {
    return (
        <div className='containerpadding container mx-auto mt-12'>
            <div className='w-full relative' style={{ height: 'auto' }}>
                <Image
                    src='/images/Home/Line.svg'
                    alt='section2'
                    width={8914}
                    height={459}
                    className='w-full h-auto'
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
            <div className='bg-lightbrown w-full h-[1px]'>
            </div>
            <div className='bg-lightbrown w-full h-[1px] mt-[30px]'>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-5'>
                <div className='col-span-3 text-blackbrown text-xl font-bold mt-[20px] mb-[20px] flex flex-col'>
                    <div>
                        <h1 className='text-blackbrown title'>
                            Wooden Craft
                        </h1>
                    </div>
                    <div className='bg-lightbrown w-full h-[1px] mt-[20px]'>
                    </div>
                    <div className='w-full relative py-6 pr-6 h-[300px] sm:h-[300px] md:h-[300px] lg:h-[400px] xl:h-auto xl:flex-1 min-h-0'>
                        <Image
                            src='/images/Home/WoodenCrafts.png'
                            alt='section2'
                            fill
                            sizes="(max-width: 1280px) 100vw, 60vw"
                            className='object-cover w-full xl:pr-6 pt-6'
                        />
                    </div>
                </div>

                <div className='col-span-2 flex flex-col'>
                    <div className='flex flex-row '>
                        <div className='bg-lightbrown w-[1px] min-h-full'>
                        </div>
                        <div className='flex-1'>
                            <p className='description text-blackbrown m-5'>
                                Our wooden crafts collection showcases the timeless artistry of Sri Lankan carpentry. From hand-carved figurines and traditional masks to functional home décor like bowls, trays, and furniture, each piece reflects the natural beauty of wood and the skill of master artisans. Using sustainable wood and age-old carving techniques, these crafts tell stories of heritage, spirituality, and nature, making them perfect for collectors, gifts, and interior design enthusiasts.
                            </p>

                            <p className='description text-blackbrown m-5'>
                                Wooden crafts represent one of the oldest and most admired forms of Sri Lankan artistry. Each item in this collection is carefully handcrafted by skilled artisans who pass their knowledge down through generations. From intricately carved masks that tell stories of folklore to functional items like trays, bowls, and furniture, every piece showcases the natural beauty of wood. The smooth textures, detailed patterns, and warm tones highlight the close relationship between artisans and nature.                            </p>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
        </div>
    )
}

export default Section4
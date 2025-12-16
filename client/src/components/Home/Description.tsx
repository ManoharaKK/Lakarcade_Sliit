import React from 'react'
import Image from 'next/image'

function Description() {
    return (
        <div className='containerpadding container mx-auto '>
            <div className='bg-lightbrown w-full h-[1px]'>
            </div>
            <div className='bg-lightbrown w-full h-[1px] mt-[30px]'>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-5 flex flex-col'>
                <div className='col-span-3 text-blackbrown text-xl font-bold mt-[20px] mb-[20px]'>
                    <div>
                        <h1>
                            Wooden Craft
                        </h1>
                    </div>
                    <div className='bg-lightbrown w-full h-[1px] mt-[20px]'>
                    </div>
                </div>

                <div className='col-span-2 '>
                    <div className='flex flex-row '>
                        <div className='bg-lightbrown w-[1px] min-h-full'>
                        </div>
                        <div className='flex-1'>
                            <p className='text-blackbrown m-5'>
                                Our wooden crafts collection showcases the timeless artistry of Sri Lankan carpentry. From hand-carved figurines and traditional masks to functional home décor like bowls, trays, and furniture, each piece reflects the natural beauty of wood and the skill of master artisans. Using sustainable wood and age-old carving techniques, these crafts tell stories of heritage, spirituality, and nature, making them perfect for collectors, gifts, and interior design enthusiasts.
                            </p>

                            <p className='text-blackbrown m-5'>
                            Wooden crafts represent one of the oldest and most admired forms of Sri Lankan artistry. Each item in this collection is carefully handcrafted by skilled artisans who pass their knowledge down through generations. From intricately carved masks that tell stories of folklore to functional items like trays, bowls, and furniture, every piece showcases the natural beauty of wood. The smooth textures, detailed patterns, and warm tones highlight the close relationship between artisans and nature.                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description
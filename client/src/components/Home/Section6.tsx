import React from 'react'
import Image from 'next/image'
function Section6() {
    return (
        <div className='containerpadding container mx-auto mt-4'>

            <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='lg:border-r lg:border-lightbrown lg:pr-6'>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <h1 className='text-blackbrown title my-5'>
                        Metal & Brass Work
                    </h1>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <Image
                        src='/images/Home/Mask.png'
                        alt='section2'
                        width={500}
                        height={500}
                        className='w-full h-auto mt-5'
                    />
                    <p className='description text-blackbrown  mt-5 mb-5 '>
                    Sri Lankan’s traditional masks are world-renowned for their mystical beauty and cultural significance. Whether used in rituals, dance performances, or as wall décor, these masks embody folklore, spirituality, and protection. Hand-carved from light wood and painted with vivid natural colors, they represent characters from myths and legends, making them powerful symbols of Sri Lankan identity. Our collection also features other cultural art forms that bring heritage to life.
                    </p>
                </div>
                <div className='lg:pl-6'>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <h1 className='text-blackbrown title my-5'>
                        Metal & Brass Work
                    </h1>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <p className='description text-blackbrown  mt-5'> 
                    Sustainability meets creativity in our eco-friendly crafts collection. Featuring products made from recycled, upcycled, and natural materials like coconut shells, bamboo, palm leaves, and jute, these crafts support both the environment and local communities. From household décor to everyday essentials, each item proves that beauty and responsibility can coexist. By choosing these crafts, you’re making a positive impact while owning a piece of ethical artistry.
                    </p>
                    <Image
                        src='/images/Home/Eco.png'
                        alt='section2'
                        width={500}
                        height={500}
                        className='w-full h-auto mt-5 mb-5'
                    />
                </div>
            </div>
            <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
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
        </div>
    )
}

export default Section6
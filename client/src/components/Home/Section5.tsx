import React from 'react'
import Image from 'next/image'

function Section5() {
    return (
        <div className='containerpadding container mx-auto mt-4'>
            <div className='grid grid-cols-1 xl:grid-cols-3'>
                <div className='xl:border-r xl:border-lightbrown xl:pr-6'>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <h1 className='text-blackbrown title my-5 text-center'>
                    Metal & Brass Work
                    </h1>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <div className='w-full relative py-6 items-center justify-center h-[300px] sm:h-[300px] md:h-[300px] lg:h-[400px] xl:h-[300px] xl:w-full'>
                        <Image
                            src='/images/Home/Metal.png'
                            alt='section2'
                            fill
                            sizes="(max-width: 1280px) 100vw, 60vw"
                            className='object-cover w-full p-4'
                        />
                    </div>
                    <p className='description text-blackbrown mx-5 mb-5'>
                    Sri Lankan artisans have mastered the art of metalwork for centuries, and this collection celebrates their legacy. From intricately designed brass oil lamps and traditional kitchenware to modern jewelry and décor items, each product embodies durability, sophistication, and cultural symbolism. These creations are more than just accessories—they are heritage pieces passed down through generations, carrying the strength and shine of our ancestors’ craftsmanship.                    </p>
                </div>
                <div className='xl:border-r xl:border-lightbrown xl:pr-6 xl:pl-6'>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <h1 className='text-blackbrown title my-5 text-center'>
                    Batik & Painted Crafts
                    </h1>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <div className='w-full relative py-6 items-center justify-center h-[300px] sm:h-[300px] md:h-[300px] lg:h-[400px] xl:h-[300px] xl:w-full'>
                        <Image
                            src='/images/Home/Batik.png'
                            alt='section2'
                            fill
                            sizes="(max-width: 1280px) 100vw, 60vw"
                            className='object-cover w-full p-4'
                        />
                    </div>
                    <p className='description text-blackbrown mx-5 mb-5'>
                    Batik artistry is one of Sri Lanka’s most vibrant traditions, blending fabric with bold designs and natural dyes. Our batik collection features wall hangings, clothing, cushion covers, and decorative items that showcase colorful storytelling through patterns and motifs. Each piece is handmade, meaning no two designs are ever identical—making your purchase truly one-of-a-kind. Beyond beauty, these crafts also promote eco-friendly, sustainable fashion rooted in cultural pride.                    </p>
                </div>
                <div className='xl:pl-6'>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <h1 className='text-blackbrown title my-5 text-center'>
                    Jewelry & Accessories
                    </h1>
                    <div className='bg-lightbrown w-full h-[1px]'>
                    </div>
                    <div className='w-full relative py-6 items-center justify-center h-[300px] sm:h-[300px] md:h-[300px] lg:h-[400px] xl:h-[300px] xl:w-full'>
                        <Image
                            src='/images/Home/Jewelry.png'
                            alt='section2'
                            fill
                            sizes="(max-width: 1280px) 100vw, 60vw"
                            className='object-cover w-full p-4'
                        />
                    </div>
                    <p className='description text-blackbrown mx-5 mb-5'>
                    Handcrafted jewelry and accessories bring a unique charm that mass-produced items cannot replicate. Our collection includes beaded necklaces, handwoven bangles, gemstone jewelry, and accessories crafted with natural materials like coconut shells and seeds. These designs not only enhance your style but also carry cultural depth, symbolizing harmony with nature and the island’s heritage. Perfect for gifting or personal wear, each piece adds an authentic touch to your story.                    </p>
                </div>

            </div>
        </div>
    )
}

export default Section5
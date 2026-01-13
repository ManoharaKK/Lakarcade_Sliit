import React from 'react'
import Image from 'next/image'
import Mint from '@/components/NFTPage/Mint'
import AboutNft from '@/components/NFTPage/AboutNft'
import QandA from '@/components/NFTPage/QandA'
import Footer from '@/components/Footer/Footer'
import Section9 from '@/components/Home/Section9'
function page() {
    return (
        <div>
            <div>
                <div className='containerpadding container mx-auto w-full relative h-screen overflow-hidden'>
                    <div className='absolute inset-0 hero-zoom-in'>
                        <Image
                            src='/images/NFT/Hero.png'
                            alt='NFT Market'
                            fill
                            className='object-cover'
                            priority
                            sizes="100vw"
                        />
                    </div>
                    {/* Dark Overlay */}
                    <div className='absolute inset-0 bg-black/50'></div>
                    {/* Overlay Content */}
                    <div className='absolute inset-0 flex items-end justify-start pb-20 sm:pb-24 md:pb-32 z-10'>
                        <div className='containerpadding container mx-auto text-left px-4'>
                            <h1 className='text-primary title mb-4 sm:mb-6 md:mb-8 uppercase'>
                                Own a piece of Sri Lanka's Heritage
                            </h1>
                            <p className='text-primary description mb-6 sm:mb-8 md:mb-10 max-w-3xl'>
                                Experience the beauty of authentic Sri Lankan handicrafts, secured with NFTs for tamper-proof authenticity, cultural storytelling, and lifetime artisan royalties. Invest, collect, and preserve tradition while supporting local creators.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-4 justify-start items-start'>
                                <button className='bg-secondarybrown text-primary py-3 px-8 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'>
                                    Invest Now
                                </button>
                                <button className='bg-transparent border border-primary text-primary py-3 px-8 rounded hover:bg-primary hover:text-blackbrown transition-colors font-semibold'>
                                    Explore Handicrafts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='containerpadding container mx-auto'>
                    {/* Content section can go here */}
                </div>
                <div className='containerpadding container mx-auto'>
                    <div className='w-full relative mt-12' style={{ height: 'auto' }}>
                        <Image
                            src='/images/Home/Line.svg'
                            alt='section2'
                            width={8914}
                            height={459}
                            className='w-full h-auto'
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <Mint />
                    <div className='w-full relative mt-12' style={{ height: 'auto' }}>
                        <Image
                            src='/images/Home/Line.svg'
                            alt='section2'
                            width={8914}
                            height={459}
                            className='w-full h-auto'
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <AboutNft />
                    <div className='w-full relative mt-12' style={{ height: 'auto' }}>
                        <Image
                            src='/images/Home/Line.svg'
                            alt='section2'
                            width={8914}
                            height={459}
                            className='w-full h-auto'
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <QandA />
                    <div className='bg-lightbrown w-full h-[1px] mt-12'>
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

                    <div className=' mt-4'>
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

                    <div className=' mt-4'>

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

                   
                </div>
            </div>
            <Section9 />
            <Footer />
        </div>
    )
}

export default page


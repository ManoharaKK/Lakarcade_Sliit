'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Village from '../Village'
import Footer from '../../../components/Footer/Footer'
import Section9 from '../../../components/Home/Section9'

    
interface Product {
    _id: string
    id: string
    viewCount?: number
    title: string
    subtitle?: string
    price: number
    earlyPrice?: number
    discountPercentage?: number
    salesEndDate?: string
    localTaxesIncluded?: string | boolean
    material?: string
    dimensions?: string | {
        length: string
        width: string
        height: string
    }
    weight?: string
    color?: string
    craftTechnique?: string
    origin?: string
    authenticity?: string
    careInstruction?: string | string[]
    shipping?: string
    returnsDescription?: string
    images: string[]
    artisanStory?: string
    selectVillage?: string
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const productId = params.id as string
            const response = await fetch(`http://localhost:4000/api/products/${productId}`)
            if (response.ok) {
                const data = await response.json()
                if (data.success && data.data) {
                    setProduct(data.data)
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    // Parse dimensions string into object
    const parseDimensions = (dimensions: string | { length: string; width: string; height: string } | undefined) => {
        if (!dimensions) return { length: '', width: '', height: '' }
        if (typeof dimensions === 'object') return dimensions
        
        // Try to parse formats like "20cm x 15cm x 10cm" or "20 x 15 x 10 cm"
        const patterns = [
            /(\d+(?:\.\d+)?)\s*(?:cm|m|in|ft)?\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm|m|in|ft)?\s*x\s*(\d+(?:\.\d+)?)\s*(?:cm|m|in|ft)?/i,
            /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i
        ]
        
        for (const pattern of patterns) {
            const match = dimensions.match(pattern)
            if (match) {
                return {
                    length: match[1] || '',
                    width: match[2] || '',
                    height: match[3] || ''
                }
            }
        }
        
        return { length: '', width: '', height: '' }
    }

    const renderStars = (count: number) => {
        return (
            <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < count ? 'text-secondarybrown fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        )
    }

    if (loading) {
        return (
            <div className='containerpadding container mx-auto mt-[188px] sm:mt-[190px] md:mt-[195px] lg:mt-[168px] xl:mt-[168px] py-10'>
                <p className='text-center text-blackbrown'>Loading product...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className='containerpadding container mx-auto mt-[188px] sm:mt-[190px] md:mt-[195px] lg:mt-[168px] xl:mt-[168px] py-10'>
                <p className='text-center text-blackbrown'>Product not found</p>
                <Link href='/Market' className='text-secondarybrown hover:underline block text-center mt-4'>
                    Back to Market
                </Link>
            </div>
        )
    }

    const dimensions = parseDimensions(product.dimensions)

    return (
        <div>
        <div className='containerpadding container mx-auto mt-[188px] sm:mt-[190px] md:mt-[195px] lg:mt-[168px] xl:mt-[168px] py-8'>
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className='mb-6 text-secondarybrown hover:text-secondarybrown/80 transition-colors flex items-center gap-2'
            >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                Back
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Left Column - Images */}
                <div className='flex flex-col lg:sticky lg:top-[188px] lg:self-start lg:border-r lg:border-lightbrown lg:pr-8'>
                    {product.images && product.images.length > 0 && (
                        <>
                            <div className='grid grid-cols-3 gap-2 mb-2'>
                                {/* Main Large Image - Shows Selected Image */}
                                <div className='col-span-3 border border-[#463e20] bg-[#63541F] relative aspect-square overflow-hidden'>
                                    <Image
                                        src={product.images[selectedImage] || product.images[0]}
                                        alt={`${product.title} - Main`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                        className='object-cover'
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Grid */}
                            {product.images.length > 1 && (
                                <div className='grid grid-cols-4 gap-2'>
                                    {product.images.slice(1, 5).map((image, index) => (
                                        <div 
                                            key={index + 1} 
                                            className='col-span-1 border border-[#463e20] relative aspect-square overflow-hidden'
                                        >
                                            <Image
                                                src={image || product.images[0]}
                                                alt={`${product.title} - ${index + 2}`}
                                                fill
                                                sizes="(max-width: 1024px) 25vw, 16vw"
                                                className='object-cover cursor-pointer hover:opacity-80 transition-opacity'
                                                onClick={() => setSelectedImage(index + 1)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Right Column - Product Details */}
                <div className='lg:pr-2'>
                {product.viewCount && (
                    <p className='text-blackbrown text-sm '>
                        <span className=''>{product.viewCount}<span className='text-secondarybrown font-regular'>+ View in the last <span className='text-[#B92024]'>24 hours</span></span></span>
                    </p>
                )}
                    <h1 className='text-blackbrown producttitle mb-2'>{product.title}</h1>
                    {product.subtitle && (
                        <p className='text-blackbrown productsubtitle mb-4'>{product.subtitle}</p>
                    )}


                    {/* Price Section */}
                    <div className=''>
                        <div className='flex items-center  gap-4 mb-4'>
                            <div>
                                <p className='text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-4xl 2xl:text-6xl mt-4 text-[#B92024]'>${product.price.toFixed(2)}</p>
                            </div>
                            {product.earlyPrice && (
                                <div>
                                    <p className='text-blackbrown text-xl line-through opacity-70'>
                                        ${product.earlyPrice.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {product.discountPercentage && product.discountPercentage > 0 && (
                                <div className='bg-[#6A642D] text-primary px-3 py-1'>
                                    <p className='font-semibold'>{product.discountPercentage}% OFF</p>
                                </div>
                            )}
                        </div>
                        {product.earlyPrice && (
                            <p className='text-blackbrown text-sm line-through opacity-70 mb-2'>
                                Early Price: ${product.earlyPrice.toFixed(2)}
                            </p>
                        )}
                        {product.localTaxesIncluded && (
                            <p className='text-blackbrown description mb-4'>Local taxes included</p>
                        )}
                        
                    </div>

                    {/* Product Information */}
                    <div className='mb-6'>
                        {product.material && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Material : <span className='text-secondarybrown font-normal'>{product.material}</span></h3>
                            </div>
                        )}
                        {dimensions.length && dimensions.width && dimensions.height && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Dimensions : <span className='text-secondarybrown font-normal'>{dimensions.length} × {dimensions.width} × {dimensions.height}</span></h3>
                            </div>
                        )}
                        {product.weight && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Weight : <span className='text-secondarybrown font-normal'>{product.weight}</span></h3>
                            </div>
                        )}
                        {product.color && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Color : <span className='text-secondarybrown font-normal'>{product.color}</span></h3>
                            </div>
                        )}
                        {product.craftTechnique && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Craft Technique : <span className='text-secondarybrown font-normal'>{product.craftTechnique}</span></h3>
                            </div>
                        )}
                        {product.origin && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Origin : <span className='text-secondarybrown font-normal'>{product.origin}</span></h3>
                            </div>
                        )}
                        {product.authenticity && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Authenticity : <span className='text-secondarybrown font-normal'>{product.authenticity}</span></h3>
                            </div>
                        )}
                        {product.careInstruction && (
                            <div className='mt-4'>
                                <h2 className='text-blackbrown'>Care Instructions:</h2>
                                <ul className='text-blackbrown description pl-6 space-y-2 list-none'>
                                    {(Array.isArray(product.careInstruction) 
                                        ? product.careInstruction 
                                        : (product.careInstruction || '').split('\n')
                                    ).filter(line => line && line.trim()).map((instruction, index) => (
                                        <li key={index} className='mb-2 flex items-start'>
                                            <span className='inline-block w-2 h-2 rounded-full bg-blackbrown mr-3 mt-2 flex-shrink-0'></span>
                                            <span>{String(instruction).replace(/^•\s*/, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.shipping && (
                            <div className='mt-4'>
                                <h3 className='text-blackbrown font-bold'>Shipping : <span className='text-secondarybrown font-normal'>{product.shipping}</span></h3>
                            </div>
                        )}
                        {product.returnsDescription && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Returns : <span className='text-secondarybrown font-normal'>{product.returnsDescription}</span></h3>
                            </div>
                        )}
                        {product.selectVillage && (
                            <div>
                                <h3 className='text-blackbrown font-bold'>Village : <span className='text-secondarybrown font-normal'>{product.selectVillage}</span></h3>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                            <button className='w-full bg-secondarybrown text-primary py-3 px-6  hover:bg-secondarybrown/90 transition-colors font-semibold'>
                                Buy Now
                            </button>
                            <button className='w-full bg-transparent border border-primarybrown text-secondarybrown py-3 px-6  hover:bg-secondarybrown hover:text-primary transition-colors font-semibold'>
                                Add to Cart
                            </button>
                        </div>
                </div>
            </div>
            <div className='bg-lightbrown w-full h-[1px] mt-5'>
            </div>
            <div className='bg-lightbrown w-full h-[1px] mt-12'>
            </div>
            {/* Additional Sections */}
            <div className='mt-5 space-y-4'>
                {/* Artisan Story */}
                {product.artisanStory && (
                    <div className=''>
                        <h2 className='text-blackbrown title mb-4'>Artisan Story</h2>
                        <p className='text-blackbrown description'>{product.artisanStory}</p>
                    </div>
                )}
                <div className='bg-lightbrown w-full h-[1px] mt-5'>
                </div>
                <div className='w-full relative ' style={{ height: 'auto' }}>
                <Image
                    src='/images/Home/Line.svg'
                    alt='section2'
                    width={8914}
                    height={459}
                    className='w-full h-auto'
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
                
                {product.selectVillage && (
                    <Village villageName={product.selectVillage} />
                )}
                
                
            </div>
            <div className='w-full relative mt-5' style={{ height: 'auto' }}>
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
            
            <Section9 />
            <Footer />
        </div>
    )
}


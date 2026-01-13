'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  _id: string
  id: string
  title: string
  price: number
  earlyPrice?: number
  discountPercentage?: number
  images: string[]
  category?: string
  branches?: string
  material?: string
  dimensions?: string
  weight?: string
}

interface ProductProps {
  selectedCategory?: string
  selectedSize?: string
  selectedWeight?: string
  minPrice?: string
  maxPrice?: string
  branches?: string[]
  materials?: string[]
  ratings?: string[]
}

function Product({ 
  selectedCategory, 
  selectedSize, 
  selectedWeight, 
  minPrice, 
  maxPrice, 
  branches = [], 
  materials = [],
  ratings = []
}: ProductProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const productsPerPage = 9

    useEffect(() => {
        fetchProducts()
    }, [])

    // Filter products based on sidebar filters
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
            return false
        }

        // Branches filter
        if (branches.length > 0 && (!product.branches || !branches.includes(product.branches))) {
            return false
        }

        // Price filter
        if (minPrice || maxPrice) {
            const productPrice = product.price || 0
            const min = minPrice ? parseFloat(minPrice) : 0
            const max = maxPrice ? parseFloat(maxPrice) : 999999
            if (productPrice < min || productPrice > max) {
                return false
            }
        }

        // Material filter
        if (materials.length > 0 && (!product.material || !materials.includes(product.material))) {
            return false
        }

        // Size filter (based on dimensions)
        if (selectedSize && product.dimensions) {
            const dims = product.dimensions.toLowerCase()
            if (selectedSize === 'Under 10 cm' && !dims.includes('10')) {
                // Check if any dimension is under 10cm
                const dimNumbers = dims.match(/\d+(?:\.\d+)?/g) || []
                const hasUnder10 = dimNumbers.some(num => parseFloat(num) < 10)
                if (!hasUnder10) return false
            } else if (selectedSize === '10 cm – 20 cm') {
                const dimNumbers = dims.match(/\d+(?:\.\d+)?/g) || []
                const inRange = dimNumbers.some(num => {
                    const val = parseFloat(num)
                    return val >= 10 && val <= 20
                })
                if (!inRange) return false
            } else if (selectedSize === '20 cm – 40 cm') {
                const dimNumbers = dims.match(/\d+(?:\.\d+)?/g) || []
                const inRange = dimNumbers.some(num => {
                    const val = parseFloat(num)
                    return val >= 20 && val <= 40
                })
                if (!inRange) return false
            } else if (selectedSize === '40 cm – 60 cm') {
                const dimNumbers = dims.match(/\d+(?:\.\d+)?/g) || []
                const inRange = dimNumbers.some(num => {
                    const val = parseFloat(num)
                    return val >= 40 && val <= 60
                })
                if (!inRange) return false
            } else if (selectedSize === '60 cm – 100 cm') {
                const dimNumbers = dims.match(/\d+(?:\.\d+)?/g) || []
                const inRange = dimNumbers.some(num => {
                    const val = parseFloat(num)
                    return val >= 60 && val <= 100
                })
                if (!inRange) return false
            }
        }

        // Weight filter
        if (selectedWeight && product.weight) {
            const weightStr = product.weight.toLowerCase()
            const weightValue = parseFloat(weightStr.match(/\d+(?:\.\d+)?/)?.[0] || '0')
            const isKg = weightStr.includes('kg')
            const weightInGrams = isKg ? weightValue * 1000 : weightValue

            if (selectedWeight === 'Lightweight (0–500g)' && weightInGrams > 500) return false
            if (selectedWeight === 'Medium Weight (500g – 2kg)' && (weightInGrams < 500 || weightInGrams > 2000)) return false
            if (selectedWeight === 'Heavy (2kg – 5kg)' && (weightInGrams < 2000 || weightInGrams > 5000)) return false
            if (selectedWeight === 'Extra Heavy (5kg – 10kg)' && (weightInGrams < 5000 || weightInGrams > 10000)) return false
            if (selectedWeight === 'Ultra Heavy (10kg+)' && weightInGrams < 10000) return false
        }

        return true
    })

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    
    // Calculate which products to show on current page
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategory, selectedSize, selectedWeight, minPrice, maxPrice, branches, materials, ratings])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:4000/api/products')
            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    setProducts(data.data || [])
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) {
        return (
            <div className='text-center py-8'>
                <p className='text-blackbrown'>Loading products...</p>
            </div>
        )
    }

    if (filteredProducts.length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-blackbrown'>No products match your filters</p>
            </div>
        )
    }

    return (
        <>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4 mt-5'>
            {currentProducts.map((product) => (
                <div key={product._id || product.id} className='border border-[#463e20] overflow-hidden flex flex-col h-full'>
                    <div className='h-[80px] flex items-center justify-center border-b border-[#463e20] p-4'>
                        <h1 className='text-blackbrown text-center font-bold line-clamp-2 overflow-hidden'>
                            {product.title}
                        </h1>
                    </div>
                    <div className='h-[300px] sm:h-[350px] md:h-[300px] lg:h-[350px] xl:h-[300px] 2xl:h-[350px] border-b border-[#463e20] relative overflow-hidden'>
                        {product.images && product.images.length > 0 ? (
                            <Image 
                                src={product.images[0]} 
                                alt={product.title} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                                className='object-cover' 
                            />
                        ) : (
                            <div className='w-full h-full bg-lightbrown flex items-center justify-center'>
                                <p className='text-blackbrown/50'>No image</p>
                            </div>
                        )}
                    </div>
                    
                    <div className='bg-lightbrown w-full h-auto p-2 border-t border-[#463e20]'>
                        <div className='flex justify-between items-center mb-3'>
                            <div>
                                <p className='text-blackbrown text-sm'>Current Price</p>
                                <p className='text-blackbrown font-semibold'>${product.price?.toFixed(2) || '0.00'}</p>
                                {product.discountPercentage && product.discountPercentage > 0 && (
                                    <p className='text-secondarybrown text-xs font-semibold'>
                                        {product.discountPercentage}% OFF
                                    </p>
                                )}
                            </div>
                            {product.earlyPrice && (
                                <div className='text-right'>
                                    <p className='text-blackbrown text-sm'>Early Price</p>
                                    <p className='text-blackbrown text-sm line-through opacity-70'>
                                        ${product.earlyPrice.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className='flex gap-2'>
                            <button className='flex-1 bg-secondarybrown  py-2 px-4  hover:bg-secondarybrown/90 transition-colors font-semibold'>
                                Buy Now
                            </button>
                            <Link 
                                href={`/Market/${product.id || product._id}`}
                                className='flex-1 bg-transparent border border-secondarybrown text- py-2 px-4  hover:bg-secondarybrown hover:text-primary transition-colors font-semibold text-center'
                            >
                                View More
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8'>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='px-4 py-2 bg-secondarybrown text-primary  hover:bg-secondarybrown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    aria-label='Previous page'
                >
                    Previous
                </button>
                
                <div className='flex gap-2'>
                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        // Show first page, last page, current page, and pages around current
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2  transition-colors ${
                                        currentPage === page
                                            ? 'bg-secondarybrown text-primary'
                                            : 'bg-lightbrown text-blackbrown hover:bg-secondarybrown/50'
                                    }`}
                                    aria-label={`Go to page ${page}`}
                                >
                                    {page}
                                </button>
                            )
                        } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                        ) {
  return (
                                <span key={page} className='px-2 text-blackbrown'>
                                    ...
                                </span>
                            )
                        }
                        return null
                    })}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='px-4 py-2 bg-secondarybrown text-primary  hover:bg-secondarybrown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    aria-label='Next page'
                >
                    Next
                </button>
            </div>
        )}
        </>
  )
}

export default Product
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import productData from './product.json'

interface Product {
  id: number
  title: string
  price: number
  earlyPrice: number
  discountPercentage: number
  images: string[]
}

function Product() {
    const [currentPage, setCurrentPage] = useState(1)
    const products = productData as Product[]
    const productsPerPage = 9
    const totalPages = Math.ceil(products.length / productsPerPage)
    
    // Calculate which products to show on current page
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const currentProducts = products.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4 mt-5'>
            {currentProducts.map((product) => (
                <div key={product.id} className='border border-[#463e20] overflow-hidden flex flex-col h-full'>
                    <div className='h-[80px] flex items-center justify-center border-b border-[#463e20] p-4'>
                        <h1 className='text-blackbrown text-center font-bold line-clamp-2 overflow-hidden'>
                            {product.title}
                        </h1>
                    </div>
                    <div className='h-[300px] sm:h-[350px] md:h-[300px] lg:h-[350px] xl:h-[300px] 2xl:h-[350px] border-b border-[#463e20] relative overflow-hidden'>
                        <Image 
                            src={product.images[0]} 
                            alt={product.title} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                            className='object-cover' 
                        />
                    </div>
                    
                    <div className='bg-lightbrown w-full h-auto p-2 border-t border-[#463e20]'>
                        <div className='flex justify-between items-center mb-3'>
                            <div>
                                <p className='text-blackbrown text-sm'>Current Price</p>
                                <p className='text-blackbrown font-semibold'>${product.price.toFixed(2)}</p>
                                {product.discountPercentage > 0 && (
                                    <p className='text-secondarybrown text-xs font-semibold'>
                                        {product.discountPercentage}% OFF
                                    </p>
                                )}
                            </div>
                            <div className='text-right'>
                                <p className='text-blackbrown text-sm'>Early Price</p>
                                <p className='text-blackbrown text-sm line-through opacity-70'>
                                    ${product.earlyPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <button className='flex-1 bg-secondarybrown  py-2 px-4  hover:bg-secondarybrown/90 transition-colors font-semibold'>
                                Buy Now
                            </button>
                            <Link 
                                href={`/Market/${product.id}`}
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
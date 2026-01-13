'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import reviewData from './Review.json'

interface Review {
    id: number
    starCount: number
    profilePic: string
    name: string
    description: string
}

function Review() {
    const reviews = reviewData as Review[]
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // Number of reviews to show at once: 1 on mobile, 4 on xl
    const reviewsPerPage = 4
    const totalPages = Math.ceil(reviews.length / reviewsPerPage)
    const showCarousel = reviews.length > reviewsPerPage

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
    }

    const getVisibleReviews = () => {
        const start = currentIndex * reviewsPerPage
        return reviews.slice(start, start + reviewsPerPage)
    }

    const renderStars = (count: number) => {
        return (
            <div className='flex flex-row items-center gap-2'>
                {[...Array(5)].map((_, index) => (
                    <Image 
                        key={index} 
                        src='/images/Review/Start.svg' 
                        alt='Star' 
                        width={500} 
                        height={500} 
                        className={`w-7 h-auto ${index < count ? 'opacity-100' : 'opacity-30'}`} 
                    />
                ))}
            </div>
        )
    }

    return (
        <div className='mt-5 relative'>
            {showCarousel && (
                <>
                    <button
                        onClick={prevSlide}
                        className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-secondarybrown text-primary p-3 rounded-full hover:bg-secondarybrown/90 transition-colors shadow-lg'
                        aria-label='Previous reviews'
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                    </button>
                    
                    <div className='overflow-hidden bg-[#EFDEC2]'>
                        <div 
                            className='flex transition-transform duration-300 ease-in-out'
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {reviews.map((review, index) => (
                                <div key={review.id} className={`w-full xl:w-1/4 flex-shrink-0 xl:min-w-[25%] ${index < reviews.length - 1 ? 'xl:border-r xl:border-lightbrown' : ''}`}>
                                    <div>
                                        <div className='flex flex-row items-center justify-between bg-lightbrown w-full h-auto p-4'>
                                            {renderStars(review.starCount)}
                                            <span className='text-blackbrown font-semibold'>{review.starCount}/5</span>
                                        </div>
                                        <div className='p-4'>
                                            <div>
                                                <Image src={review.profilePic} alt={review.name} width={500} height={500} className='w-20 h-auto' />
                                            </div>
                                            <h1 className='text-blackbrown text-2xl my-5'>
                                                "{review.name}
                                            </h1>
                                            <p className='text-blackbrown description'>
                                                {review.description}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-secondarybrown text-primary p-3 rounded-full hover:bg-secondarybrown/90 transition-colors shadow-lg'
                        aria-label='Next reviews'
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                    </button>

                    <div className='flex justify-center gap-2 mt-4'>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentIndex 
                                        ? 'bg-secondarybrown w-8' 
                                        : 'bg-lightbrown w-2 hover:bg-secondarybrown/50'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {!showCarousel && (
                <div className='grid grid-cols-1 xl:grid-cols-4 bg-[#EFDEC2]'>
                    {reviews.map((review, index) => (
                        <div key={review.id} className={index < reviews.length - 1 ? 'xl:border-r xl:border-lightbrown' : ''}>
                            <div>
                                <div className='flex flex-row items-center justify-between bg-lightbrown w-full h-auto p-4'>
                                    {renderStars(review.starCount)}
                                    <span className='text-blackbrown font-semibold'>{review.starCount}/5</span>
                                </div>
                                <div className='p-4'>
                                    <div>
                                        <Image src={review.profilePic} alt={review.name} width={500} height={500} className='w-20 h-auto' />
                                    </div>
                                    <h1 className='text-blackbrown text-2xl my-5'>
                                        "{review.name}
                                    </h1>
                                    <p className='text-blackbrown description'>
                                        {review.description}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Review
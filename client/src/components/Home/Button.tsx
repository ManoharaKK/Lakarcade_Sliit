import React from 'react'

function Button() {
    return (
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <button className='bg-lightbrown text-white px-3 py-1.5 md:px-4 md:py-2 mt-3 md:mt-5 text-sm md:text-base cursor-pointer hover:bg-primarybrown transition-colors'>
                Explore Marketplace
            </button>
            <button className='bg-transparent border-2 border-lightbrown text-white px-3 py-1.5 md:px-4 md:py-2 mt-3 md:mt-5 text-sm md:text-base cursor-pointer hover:bg-lightbrown transition-colors'>
                Explore Marketplace
            </button>
        </div>
    )
}

export default Button
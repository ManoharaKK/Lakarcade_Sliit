'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Product from './Product'
import Section9 from '../../components/Home/Section9'
import Footer from '../../components/Footer/Footer'

function Page() {
  const [selectedCategory, setSelectedCategory] = useState('Textiles & Fabric')
  const [selectedSize, setSelectedSize] = useState('10 cm – 20 cm')
  const [selectedWeight, setSelectedWeight] = useState('Medium Weight (500g – 2kg)')
  const [minPrice, setMinPrice] = useState('50')
  const [maxPrice, setMaxPrice] = useState('200')
  const [branches, setBranches] = useState<string[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [ratings, setRatings] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleBranch = (branch: string) => {
    setBranches(prev => prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch])
  }

  const toggleMaterial = (material: string) => {
    setMaterials(prev => prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material])
  }

  const toggleRating = (rating: string) => {
    setRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating])
  }

  const renderStars = (count: number) => {
    return (
      <div className='flex gap-0.5 items-center'>
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < count ? 'text-secondarybrown fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div>
        {/* Navbar Heights by Screen Size:
            Mobile: ~188px (top banner 36px + middle 56px + bottom 96px)
            Small: ~190px
            Medium: ~195px  
            Large/XL: ~168px (top banner 36px + middle 56px + bottom 76px)
        */}
        <div className='containerpadding container mx-auto mt-[188px] sm:mt-[190px] md:mt-[195px] lg:mt-[168px] xl:mt-[168px]'>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className='xl:hidden fixed inset-0 bg-black/50 z-[35]'
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='xl:hidden fixed top-[200px] sm:top-[200px] md:top-[205px] left-4 z-[60] bg-secondarybrown text-primary p-3 rounded-lg shadow-lg hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                aria-label='Toggle sidebar'
            >
                {sidebarOpen ? (
                    <svg 
                        className='w-6 h-6' 
                        fill='none' 
                        stroke='currentColor' 
                        viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                ) : (
                    <svg 
                        className='w-6 h-6' 
                        fill='none' 
                        stroke='currentColor' 
                        viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                )}
            </button>

            <div className='grid grid-cols-1 xl:grid-cols-4 gap-6 '>
                {/* Sidebar positioned below navbar for each screen size */}
                <div className={`col-span-1 fixed xl:relative top-[188px] sm:top-[190px] md:top-[195px] lg:top-[168px] left-0 xl:inset-auto bottom-0 xl:bottom-auto z-40 xl:z-auto w-80 xl:w-auto transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0 transition-transform duration-300 ease-in-out`}>
                    <div className='sidebar bg-[#EFDEC2] p-4 xl:sticky xl:top-24 h-[calc(100vh-188px)] sm:h-[calc(100vh-190px)] md:h-[calc(100vh-195px)] lg:h-[calc(100vh-168px)] xl:h-auto overflow-y-auto'>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className='xl:hidden absolute top-4 right-4 text-blackbrown hover:text-secondarybrown transition-colors'
                            aria-label='Close sidebar'
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>

                        {/* CATEGORIES */}
                        <div className='mb-6 xl:mt-0 mt-8'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>CATEGORIES</h3>
                            <ul className='space-y-2'>
                                {['Wooden Crafts', 'Textiles & Fabric', 'Ceramics & Pottery', 'Jewelry & Accessories', 'Home & Living'].map((category) => (
                                    <li key={category}>
                                        <button
                                            onClick={() => setSelectedCategory(category)}
                                            className={`text-left w-full text-sm py-1 px-2 rounded transition-colors ${
                                                selectedCategory === category 
                                                    ? 'bg-secondarybrown text-primary' 
                                                    : 'text-blackbrown hover:bg-lightbrown/30'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* BRANCHES */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>BRANCHES</h3>
                            <ul className='space-y-2'>
                                {['One Galle face', 'Colombo City Centre Mall', 'Canowin Arcade B', 'Port city Downtown', 'Shangri-La Hambantota'].map((branch) => (
                                    <li key={branch} className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            checked={branches.includes(branch)}
                                            onChange={() => toggleBranch(branch)}
                                            className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown cursor-pointer custom-checkbox'
                                        />
                                        <label className='text-blackbrown text-sm cursor-pointer'>{branch}</label>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* PRICE */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>PRICE</h3>
                            <div className='mb-3'>
                                <input
                                    type='range'
                                    min='0'
                                    max='500'
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className='w-full h-2 bg-lightbrown rounded-lg appearance-none cursor-pointer accent-secondarybrown'
                                />
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                                <input
                                    type='text'
                                    value={`$${minPrice}`}
                                    onChange={(e) => setMinPrice(e.target.value.replace('$', ''))}
                                    className='w-20 px-2 py-1 text-sm border border-lightbrown rounded bg-primary text-blackbrown'
                                />
                                <svg className='w-5 h-5 text-secondarybrown' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                                </svg>
                                <input
                                    type='text'
                                    value={`$${maxPrice}`}
                                    onChange={(e) => setMaxPrice(e.target.value.replace('$', ''))}
                                    className='w-20 px-2 py-1 text-sm border border-lightbrown rounded bg-primary text-blackbrown'
                                />
                            </div>
                            <button className='bg-secondarybrown text-primary px-4 py-2 rounded text-sm hover:bg-secondarybrown/90 transition-colors w-full'>
                                Search price
                            </button>
                        </div>

                        {/* MATERIAL */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>MATERIAL</h3>
                            <ul className='space-y-2'>
                                {['Wood', 'Metal', 'Ceramic', 'Fabric', 'Wood and Metal'].map((material) => (
                                    <li key={material} className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            checked={materials.includes(material)}
                                            onChange={() => toggleMaterial(material)}
                                            className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown cursor-pointer custom-checkbox'
                                        />
                                        <label className='text-blackbrown text-sm cursor-pointer'>{material}</label>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* BY SIZE */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>BY SIZE</h3>
                            <ul className='space-y-2'>
                                {['Under 10 cm', '10 cm – 20 cm', '20 cm – 40 cm', '40 cm – 60 cm', '60 cm – 100 cm'].map((size) => (
                                    <li key={size}>
                                        <button
                                            onClick={() => setSelectedSize(size)}
                                            className={`text-left w-full text-sm py-1 px-2 rounded transition-colors ${
                                                selectedSize === size 
                                                    ? 'bg-secondarybrown text-primary' 
                                                    : 'text-blackbrown hover:bg-lightbrown/30'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* BY WEIGHT */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>BY WEIGHT</h3>
                            <ul className='space-y-2'>
                                {['Lightweight (0–500g)', 'Medium Weight (500g – 2kg)', 'Heavy (2kg – 5kg)', 'Extra Heavy (5kg – 10kg)', 'Ultra Heavy (10kg+)'].map((weight) => (
                                    <li key={weight}>
                                        <button
                                            onClick={() => setSelectedWeight(weight)}
                                            className={`text-left w-full text-sm py-1 px-2 rounded transition-colors ${
                                                selectedWeight === weight 
                                                    ? 'bg-secondarybrown text-primary' 
                                                    : 'text-blackbrown hover:bg-lightbrown/30'
                                            }`}
                                        >
                                            {weight}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* RATING */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>RATING</h3>
                            <ul className='space-y-2'>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <li key={rating} className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            checked={ratings.includes(rating.toString())}
                                            onChange={() => toggleRating(rating.toString())}
                                            className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown flex-shrink-0 cursor-pointer custom-checkbox'
                                        />
                                        <div className='flex items-center gap-1'>
                                            {renderStars(rating)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className='text-secondarybrown text-sm mt-2 hover:underline'>More</button>
                        </div>

                        {/* AVAILABILITY */}
                        <div className='mb-6'>
                            <h3 className='text-blackbrown font-bold text-sm mb-3 uppercase'>AVAILABILITY</h3>
                            <button className='bg-secondarybrown text-primary px-4 py-2 rounded text-sm hover:bg-secondarybrown/90 transition-colors w-full'>
                                In Stock Only
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-span-3'>
                    <h1 className='title text-blackbrown'>
                    Authentic Handicrafts for Every Home
                    </h1>
                    <p className='description text-blackbrown'>
                    Discover a curated collection of handcrafted wooden masks, pottery, textiles, and artisan-made decor—each piece created with skill, tradition, and the passion of local craftsmen.
                    </p>
                    <div className='grid grid-cols-5 gap-2 lg:gap-4 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] mt-5'>
                        <div className='h-full overflow-hidden col-span-2'>
                            <Image src='/images/MarketPlace/H1.png' alt='mask1' width={500} height={500} className='w-full h-full object-cover' />       
                        </div>
                        <div className='h-full overflow-hidden col-span-1'>
                            <Image src='/images/MarketPlace/H2.png' alt='mask2' width={500} height={500} className='w-full h-full object-cover' /> 
                        </div>
                        <div className='h-full overflow-hidden col-span-1'>
                            <Image src='/images/MarketPlace/H3.png' alt='mask3' width={500} height={500} className='w-full h-full object-cover' /> 
                        </div>
                        <div className='h-full overflow-hidden col-span-1'>
                            <Image src='/images/MarketPlace/H4.png' alt='mask4' width={500} height={500} className='w-full h-full object-cover' /> 
                        </div>
                    </div>
                    <Product />
                    
                </div>
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

export default Page
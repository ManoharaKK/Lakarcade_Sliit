'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoCartOutline } from "react-icons/io5"
import { usePathname } from 'next/navigation'

function navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className='fixed top-0 left-0 right-0 z-50'>
      <div className='bg-blackbrown p-2'>
        <div className='containerpadding container mx-auto'>
          <div className='flex justify-center items-center'>
            <p className='text-primarybrown text-xs sm:text-sm text-center'>Limited Offer! Use code NFT15 for 15% off your first purchase</p>
          </div>
        </div>
      </div>
      <div className='bg-[#F6E7CA] text-[#290E0A] py-2'>
        <div className='containerpadding container mx-auto'>
          <div className='flex justify-between items-center'>
            {/* Hamburger Menu Button - Mobile Only */}
            <div className='lg:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-[#290E0A] cursor-pointer p-2'
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Menu */}
            <div className='hidden lg:block'>
              {/* Placeholder */}
            </div>
            <div className='hidden lg:flex gap-5 xl:gap-10 items-center text-sm'>
              <a
                href="/"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/' ? 'underline font-semibold' : ''}`}
              >
                Home
              </a>
              <a
                href="/Marketplace"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Marketplace' ? 'underline font-semibold' : ''}`}
              >
                Marketplace
              </a>
              <a
                href="/NftHandycraft"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/NftHandycraft' ? 'underline font-semibold' : ''}`}
              >
                NFT Handycraft
              </a>
              <a
                href="/Artisans"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Artisans' ? 'underline font-semibold' : ''}`}
              >
                Artisans
              </a>
              <a
                href="/Virtual Museum"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Virtual Museum' ? 'underline font-semibold' : ''}`}
              >
                Virtual Museum
              </a>
              <a
                href="/Verify"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Verify' ? 'underline font-semibold' : ''}`}
              >
                Verify
              </a>
              <a
                href="/Learn"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Learn' ? 'underline font-semibold' : ''}`}
              >
                Learn
              </a>
              <a
                href="/Festivals"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Festivals' ? 'underline font-semibold' : ''}`}
              >
                Festivals
              </a>
              <a
                href="/Help"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Help' ? 'underline font-semibold' : ''}`}
              >
                Help
              </a>
            </div>
            <div className='hidden lg:block'>
              <button className='bg-[#693422] text-sm text-white px-4 py-1 hover:bg-[#693422]/90 transition-colors cursor-pointer'>Connect Wallet</button>
            </div>

            {/* Mobile - Connect Wallet Button */}
            <div className='lg:hidden'>
              <button className='bg-[#693422] text-xs text-white px-3 py-1 hover:bg-[#693422]/90 transition-colors cursor-pointer'>Connect</button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className='lg:hidden mt-4 pb-4 flex flex-col gap-3 text-sm'>
              <a
                href="/"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/Marketplace"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Marketplace' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </a>
              <a
                href="/NftHandycraft"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/NftHandycraft' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                NFT Handycraft
              </a>
              <a
                href="/Artisans"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Artisans' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Artisans
              </a>
              <a
                href="/Virtual Museum"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Virtual Museum' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Virtual Museum
              </a>
              <a
                href="/Verify"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Verify' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Verify
              </a>
              <a
                href="/Learn"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Learn' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn
              </a>
              <a
                href="/Festivals"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Festivals' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Festivals
              </a>
              <a
                href="/Help"
                className={`transition-all duration-200 hover:underline underline-offset-4 cursor-pointer ${pathname === '/Help' ? 'underline font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </a>
            </div>
          )}
        </div>
      </div>
      <div className='bg-[#693422] py-2'>
        <div className='containerpadding container mx-auto'>
          {/* Desktop Layout */}
          <div className='hidden lg:flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div>
                <Image 
                  src='/images/LAKARCADelogo.png' 
                  alt='logo' 
                  width={30} 
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <p className='text-white text-sm font-bold'>LAKARCADE</p>
                <p className='text-white text-sm'>Sri Lanka gift and receive</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-4">
              <form className="relative">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search for handicrafts, NFTs, artisans..."
                    className="w-full text-sm py-2.5 px-4 pr-12 bg-[#290E0A] text-[#290E0A] placeholder-[#F6E7CA]/60 focus:outline-none focus:ring-2 focus:ring-[#F6E7CA] border-2 border-[#F6E7CA]/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#290E0A] hover:bg-[#290E0A]/90 text-[#F6E7CA] rounded-full p-2 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <Link href="/signup" className='text-white hover:text-[#F6E7CA] text-sm transition-colors cursor-pointer'>Sign up</Link>
              </div>
              <div className='bg-[#F6E7CA] h-[20px] w-[1px]'></div>
              <div>
                <Link href="/signin" className='text-white hover:text-[#F6E7CA] text-sm transition-colors cursor-pointer'>Sign in</Link>
              </div>
            </div>
            <div>
              <IoCartOutline className='text-white text-2xl ml-4 mr-4 cursor-pointer hover:text-[#F6E7CA] transition-colors' />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className='lg:hidden'>
            <div className='flex justify-between items-center mb-3'>
              <div className='flex items-center gap-2'>
                <div>
                  <Image 
                    src='/images/LAKARCADelogo.png' 
                    alt='logo' 
                    width={25} 
                    height={25}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className='text-white text-xs font-bold'>LAKARCADE</p>
                  <p className='text-white text-[10px]'>Sri Lanka gift and receive</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Link href="/signin" className='text-white hover:text-[#F6E7CA] text-xs transition-colors cursor-pointer'>Sign in</Link>
                <IoCartOutline className='text-white text-xl cursor-pointer hover:text-[#F6E7CA] transition-colors' />
              </div>
            </div>
            <div className="w-full">
              <form className="relative">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full text-xs py-2 px-3 pr-10 bg-[#290E0A] text-white placeholder-[#F6E7CA]/60 focus:outline-none focus:ring-2 focus:ring-[#F6E7CA] border-2 border-[#F6E7CA]/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#290E0A] hover:bg-[#290E0A]/90 text-[#F6E7CA] rounded-full p-1.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default navbar
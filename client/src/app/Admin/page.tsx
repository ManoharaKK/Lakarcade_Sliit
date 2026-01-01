'use client'
import React, { useState } from 'react'
import NFTProduct from './components/NFTProduct'
import NormalProduct from './components/NormalProduct'
import VillageData from './components/VillageData'
import ArtisansData from './components/ArtisansData'

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('nft-product')

  const menuItems = [
    { id: 'nft-product', label: 'NFT Product', icon: '🎨' },
    { id: 'normal-product', label: 'Normal Product', icon: '📦' },
    { id: 'village-data', label: 'Village Data', icon: '🏘️' },
    { id: 'artisans-data', label: 'Artisans Data', icon: '👨‍🎨' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'nft-product':
        return <NFTProduct />
      case 'normal-product':
        return <NormalProduct />
      case 'village-data':
        return <VillageData />
      case 'artisans-data':
        return <ArtisansData />
      default:
        return <NFTProduct />
    }
  }

  return (
    <div className='min-h-screen bg-primary'>
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 bg-blackbrown min-h-screen fixed left-0 top-0 pt-[188px] sm:pt-[190px] md:pt-[195px] lg:pt-[168px]'>
          <div className='p-4'>
            <h1 className='text-primary title mb-6 text-center'>Admin Dashboard</h1>
            <nav className='space-y-2'>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center gap-3 ${
                    activeSection === item.id
                      ? 'bg-secondarybrown text-primary'
                      : 'text-primary hover:bg-lightbrown/30'
                  }`}
                >
                  <span className='text-xl'>{item.icon}</span>
                  <span className='text-sm font-medium'>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 ml-64 pt-[188px] sm:pt-[190px] md:pt-[195px] lg:pt-[168px]'>
          <div className='containerpadding container mx-auto p-6'>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

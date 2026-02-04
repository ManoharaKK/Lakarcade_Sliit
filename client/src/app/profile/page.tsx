'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar/navbar'
import { useAccount, useOwnedNfts } from '@/components/hooks/web3'
import { Web3Provider } from '@/components/providers'

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function ProfileContent() {
  const { account } = useAccount()
  const { nfts } = useOwnedNfts()
  const listNft = nfts.listNft
  const [selectedIndex, setSelectedIndex] = useState(0)

  const ownedNfts = nfts.data ?? []
  const loading = nfts.isLoading
  const tabs = [{ name: 'All', href: '#', current: true }]
  const selectedNft = ownedNfts.length > 0 && selectedIndex >= 0 && selectedIndex < ownedNfts.length ? ownedNfts[selectedIndex] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80">
      <Navbar />
      <div className="flex pt-28 sm:pt-32 mt-2">
        <main className="flex-1 overflow-y-auto">
          <div className="pt-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="flex items-baseline justify-between border-b border-gray-200/80 pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Your NFTs</h1>
              {ownedNfts.length > 0 && (
                <span className="text-sm text-gray-500 font-medium">{ownedNfts.length} item{ownedNfts.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="mt-6">
              <div className="hidden sm:block">
                <nav className="flex gap-1 rounded-xl bg-white/60 p-1 shadow-sm border border-gray-200/60 w-fit" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      aria-current={tab.current ? 'page' : undefined}
                      className={classNames(
                        tab.current
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/80',
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors'
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            <section className="mt-10 pb-16" aria-labelledby="gallery-heading">
              {!account.data ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/70 shadow-sm py-16 text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-gray-200/80 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <p className="text-gray-600 font-medium">Connect your wallet to see NFTs you’ve bought.</p>
                  <p className="text-sm text-gray-400 mt-1">Your collection will appear here.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/70 border border-gray-200/80 shadow-sm">
                  <div className="w-12 h-12 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 mt-4 font-medium">Loading your NFTs...</p>
                </div>
              ) : ownedNfts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/70 shadow-sm py-16 text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                  </div>
                  <p className="text-gray-600 font-medium">You haven’t bought any NFTs yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Buy from the marketplace to see them here.</p>
                </div>
              ) : (
                <ul
                  role="list"
                  className="grid grid-cols-2 gap-5 sm:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {ownedNfts.map((item, index) => (
                    <li
                      key={item.tokenId}
                      onClick={() => setSelectedIndex(index)}
                      className="relative cursor-pointer group"
                    >
                      <div
                        className={classNames(
                          selectedIndex === index
                            ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-lg'
                            : 'shadow-md hover:shadow-xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-400',
                          'block w-full aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden transition-all duration-200'
                        )}
                      >
                        <img
                          src={item.meta.image}
                          alt=""
                          className={classNames(
                            selectedIndex === index ? '' : 'group-hover:scale-105',
                            'object-cover pointer-events-none w-full h-full transition-transform duration-300'
                          )}
                        />
                        <button type="button" className="absolute inset-0 focus:outline-none">
                          <span className="sr-only">View details for {item.meta.name}</span>
                        </button>
                      </div>
                      <div className="mt-3 px-0.5">
                        <p className="block text-sm font-semibold text-gray-900 truncate">
                          {item.meta.name}
                        </p>
                        {item.isListed && (
                          <p className="text-xs font-medium text-indigo-600 mt-0.5">Listed · {item.price} ETH</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>

        <aside className="hidden w-96 flex-shrink-0 bg-white/90 backdrop-blur-sm border-l border-gray-200/80 shadow-xl overflow-y-auto lg:block mt-4">
          <div className="sticky top-32 p-6">
            {selectedNft && (
              <div className="pb-8 space-y-6">
                <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-inner ring-1 ring-gray-200/80">
                  <img src={selectedNft.meta.image} alt="" className="object-cover w-full aspect-[4/3]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {selectedNft.meta.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{selectedNft.meta.description}</p>
                  {selectedNft.isListed && (
                    <p className="text-sm font-semibold text-indigo-600 mt-2">Listed for sale · {selectedNft.price} ETH</p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Information</h3>
                  <dl className="space-y-2.5">
                    {selectedNft.meta.attributes.map((attr) => (
                      <div key={attr.trait_type} className="flex justify-between text-sm">
                        <dt className="text-gray-500 font-medium capitalize">{attr.trait_type}</dt>
                        <dd className="text-gray-900 font-semibold">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex gap-3">
                  <a
                    href={selectedNft.meta.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-500 text-white text-sm font-semibold shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download
                  </a>
                  <button
                    disabled={selectedNft.isListed}
                    onClick={() => listNft(selectedNft.tokenId, selectedNft.price)}
                    type="button"
                    className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-indigo-500 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    List Nft
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <Web3Provider>
      <ProfileContent />
    </Web3Provider>
  )
}

export default ProfilePage
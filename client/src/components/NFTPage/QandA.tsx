'use client'
import React, { useState } from 'react'
import Image from 'next/image'

function QandA() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const questions = [
    {
      title: 'Why This is Unique',
      content: 'Our NFT-based fractional ownership model represents a revolutionary approach to preserving and investing in Sri Lankan handicrafts. Unlike traditional ownership where a single collector purchases an entire artifact, our platform divides one physical handicraft into multiple NFT shares, allowing diverse investors to participate in cultural preservation. This unique model democratizes access to high-value artifacts, making investment opportunities available to people regardless of their financial capacity. Each NFT represents a verifiable fraction of ownership, secured on the blockchain, ensuring transparency and authenticity. This approach not only supports artisans financially but also creates a sustainable ecosystem where cultural heritage becomes an accessible investment vehicle for everyone.'
    },
    {
      title: 'History',
      content: 'The concept of fractional ownership through NFTs for cultural artifacts emerged as a solution to bridge the gap between traditional craftsmanship and modern technology. Sri Lankan handicrafts have been treasured for centuries, with skills passed down through generations. However, many artisans struggle to maintain sustainable livelihoods, and valuable artifacts often remain inaccessible to most people. Our platform was developed to address these challenges by combining blockchain technology with traditional craftsmanship. We began by partnering with skilled artisans from villages across Sri Lanka, understanding their needs and the cultural significance of their work. Through careful collaboration, we created a system that respects traditional values while introducing innovative ownership models that benefit both artisans and investors, ensuring that Sri Lanka\'s rich cultural heritage continues to thrive in the digital age.'
    },
    {
      title: 'Value Proposition',
      content: 'Our platform offers multiple layers of value for different stakeholders. For investors, we provide access to rare, authenticated Sri Lankan handicrafts that were previously out of reach, with the potential for value appreciation as demand grows in the secondary market. Each investment directly supports artisan communities, providing them with sustainable income and preserving traditional skills. For artisans, we offer a new revenue stream through initial sales and ongoing royalties from secondary market transactions, ensuring long-term financial stability. The blockchain technology ensures complete transparency, security, and authenticity verification, giving investors confidence in their purchases. Additionally, investors become part of a community that values cultural preservation, sustainability, and social impact, making each purchase meaningful beyond financial returns. This creates a win-win ecosystem where cultural heritage is preserved, artisans are supported, and investors can participate in something greater than traditional asset investment.'
    },
    {
      title: 'Technology & Security',
      content: 'Our platform leverages cutting-edge blockchain technology to ensure maximum security, transparency, and authenticity. Each NFT is minted on a secure blockchain network, providing immutable proof of ownership and preventing fraud or duplication. Smart contracts automatically handle transactions, royalty distributions to artisans, and ownership transfers, eliminating the need for intermediaries and reducing transaction costs. We use advanced encryption and secure wallet technology to protect user assets and personal information. Each physical artifact is linked to its NFT through QR codes and NFC tags, allowing real-time verification of authenticity. Our security protocols include multi-signature wallets, regular security audits, and compliance with international blockchain standards. Additionally, we maintain detailed records of each artifact\'s provenance, including artisan information, creation date, materials used, and cultural significance, all stored securely on-chain and accessible to NFT owners. This comprehensive approach ensures that both digital and physical assets are protected while maintaining complete transparency for all stakeholders.'
    },
    {
      title: 'How to Invest / Ownership',
      content: 'Investing in our fractional ownership model is straightforward and accessible. First, browse our marketplace to explore available handicrafts and their associated NFTs. Each physical artifact is divided into a set number of NFT shares (typically 100 shares per artifact), with the total number clearly displayed. When you find a piece you\'re interested in, you can purchase one or multiple NFT shares at the initial launch price. The purchase process involves connecting a compatible cryptocurrency wallet, selecting the number of shares desired, and completing the transaction through our secure platform. Once purchased, you receive the NFT in your wallet, representing your fractional ownership. As an owner, you can hold your shares for potential appreciation, sell them on the secondary market at any time, or trade them with other investors. Your ownership is permanently recorded on the blockchain, and you\'ll receive proportional royalties if the artifact appreciates in value. The physical artifact remains securely stored and displayed, with all NFT owners sharing collective ownership rights. You can view the artifact, participate in community decisions about its display or care, and track its value and ownership history through our platform.'
    },
    {
      title: 'Showroom / Display Context',
      content: 'Each artifact in our collection is carefully curated, authenticated, and displayed in our dedicated showroom spaces, designed to honor both the physical craftsmanship and the cultural heritage it represents. Our showrooms serve as educational and cultural centers where visitors can view the artifacts, learn about their history, meet the artisans, and understand the stories behind each piece. The physical artifacts are preserved using museum-quality conservation methods, ensuring they remain in pristine condition for generations. For NFT owners, we provide virtual tours and detailed documentation of each artifact\'s condition, location, and display context. Owners have the opportunity to visit the showrooms, attend exclusive events, and even participate in decisions about how and where artifacts are displayed. We also collaborate with museums, cultural institutions, and galleries to showcase our collection, raising awareness about Sri Lankan craftsmanship and creating opportunities for cultural exchange. This multi-layered approach ensures that the artifacts serve their dual purpose: as valuable cultural heritage pieces and as accessible investment opportunities, all while maintaining the highest standards of preservation and presentation.'
    }
  ]

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='mt-12'>
        <h1 className='title text-blackbrown items-center justify-center text-center mb-12'>
            Frequently Asked Questions
        </h1>
       
       <div>
        <video 
          src='/images/Home/Video.mp4' 
          className='w-full h-auto' 
          controls
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
       </div>
       <div className='mt-8 space-y-0'>
        {questions.map((question, index) => (
          <div key={index} className='border border-lightbrown bg-lightbrown/20'>
            <button
              onClick={() => toggleQuestion(index)}
              className='w-full flex justify-between items-center px-6 py-4 text-left hover:bg-lightbrown/30 transition-colors'
            >
              <span className='text-blackbrown font-medium'>{question.title}</span>
              <svg
                className={`w-5 h-5 text-blackbrown transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
            {openIndex === index && (
              <div className='px-6 pb-4 bg-primary'>
                <p className='text-blackbrown description'>{question.content}</p>
              </div>
            )}
          </div>
        ))}
       </div>

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

            
    </div>
  )
}

export default QandA
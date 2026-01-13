"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/Home/Button'
import Description from '@/components/Home/Description'
import { useWeb3 } from '@/components/providers/web3'
import Section2 from '@/components/Home/Section2'
import Section4 from '@/components/Home/Section4'
import Section5 from '@/components/Home/Section5'
import Section6 from '@/components/Home/Section6'
import Section7 from '@/components/Home/Section7'
import Section8 from '@/components/Home/Section8'
import Section9 from '@/components/Home/Section9'
import Footer from '@/components/Footer/Footer'
import Section3 from '@/components/Home/Section3'

function PageContent() {
  const { contract, provider } = useWeb3();

  console.log(contract);

  const getAccounts = async () => {
    const accounts = await provider!.listAccounts();
    console.log(accounts[0]);
  }
  if (provider) {
    getAccounts();
  }


  useEffect(() => {
    if (provider) {
      getAccounts();
    }

    // 1. Check if MetaMask exists
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log("MetaMask is installed");

      // 2. Request permission to access wallet
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts: unknown) => {
          // 3. Print first account (wallet address)
          const accountArray = accounts as string[];
          if (accountArray && accountArray.length > 0) {
            console.log("Wallet address:", accountArray[0]);
          }
        })
        .catch((err: any) => {
          // User rejection (4001) is expected behavior, not an error
          if (err?.code !== 4001) {
            console.error("Error connecting wallet:", err);
          }
        });
    } else {
      console.log("MetaMask is not installed");
    }
  }, [provider]);




  return (
    <div className=''>
      <div className='bg-darkbrown min-h-screen'>
        <div className='flex justify-between'>
         
          <div className='relative flex-1'>
            
            <div className='containerpadding container mx-auto mt-[188px] sm:mt-[190px] md:mt-[195px] lg:mt-[168px] xl:mt-[168px] py-10 xl:py-0 xl:h-[calc(100vh-168px)] flex items-center justify-center'>
              <div className='w-full h-[80vh] '>
                <div className='grid grid-cols-1 xl:grid-cols-5 flex flex-col gap-4 h-full'>
                  <div className='col-span-3 flex flex-col gap-4 h-full'>
                    <div className='h-[50vh] outline outline-1 outline-primarybrown flex-1 relative flex items-center justify-center pl-5 pr-5'>
                      <div className='absolute inset-0 z-0 w-[30%] right-0 left-auto mb-[20%]'>
                        <Image
                          src='/images/Home/Maskgroup.png'
                          alt='main image'
                          fill
                          className='object-contain object-right'
                        />
                      </div>
                      <div className='relative z-10'>
                        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-3xl 2xl:text-6xl font-medium'>
                          Own Authentic Sri Lankan Handicrafts with NFTs & NFC
                        </h1>

                        <p className='text-sm'>
                          Discover masterfully crafted traditional handicrafts from Sri Lankan artisans. Own them physically with NFC verification or digitally as NFTs.
                        </p>
                        <Button />
                      </div>
                    </div>
                    <div className='h-[30vh] flex-1'>
                      <div className='grid grid-cols-1  xl:grid-cols-2 gap-4 h-full'>
                        <div className='relative w-full h-[30vh] xl:h-full'>
                          <Image
                            src='/images/Home/Heroimage.png'
                            alt='main image'
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='relative w-full xl:h-full bg-green'>
                          <div className='absolute right-0 top-0 w-full h-full'>
                            <Image
                              src='/images/Home/yak.png'
                              alt='main image'
                              fill
                              className='object-contain object-right'
                            />
                          </div>
                          <div className='relative z-10 flex items-center  xl:h-full'>
                            <div className=' p-4 xl:px-4 text-[#D8BD53]'>
                              <h2 className='text-sm font-bold '>Sri Lankan Handicrafts Meet</h2>
                              <h1 className='title'>NFTs</h1>
                              <p>Handcrafted in Sri Lanka,<br /> Owned Worldwide</p>
                              <button className='bg-transparent border-1 border-[#text-[#D8BD53]] px-4 py-2 mt-5 cursor-pointer hover:bg-lightbrown transition-colors'>
                                Explore Marketplace
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='hidden xl:flex col-span-2 bg-blackbrown outline outline-1 outline-primarybrown h-full flex-1 items-center justify-center'>
                    <div className='h-[93%] w-[90%] flex items-center justify-center border-1 border-primarybrown relative'>
                      <div className='absolute inset-0'>
                        <div className='relative w-full h-full'>
                          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[25%] z-10'>
                            <Image
                              src='/images/Home/Top.png'
                              alt='main image'
                              fill
                              sizes="40vw"
                              className='object-contain'
                            />
                          </div>
                          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%]'>
                            <Image
                              src='/images/Home/Yaka.png'
                              alt='main image'
                              fill
                              sizes="32vw"
                              className='object-contain'
                            />

                          </div>
                          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[25%] z-10'>
                            <Image
                              src='/images/Home/Down.png'
                              alt='main image'
                              fill
                              sizes="40vw"
                              className='object-contain'
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className='hidden xl:block relative w-full h-full'>
             
            </div>
          </div>
        
        </div>
      </div> 
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      
      <Footer />
    </div>
  )
}

export default function page() {
  return <PageContent />
}
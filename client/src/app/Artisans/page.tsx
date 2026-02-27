'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Navbar/navbar'
import NFTForm from '@/components/NFT/NFTForm'
import SimpleNFTForm from '@/components/NFT/NFTForm'
import QRcode from '@/components/QR/QRcode'
import { NftMeta } from '../../../types/nft'
import { useWeb3 } from '@/components/providers/web3'
import axios from 'axios'
import { toast } from 'react-toastify'

function Page() {
  const [formType, setFormType] = useState<'full' | 'simple'>('full')

  const handleFullFormSubmit = (data: any) => {
    const { contractAddress, id, ...nftMeta } = data
    console.log('Full Form Data (meta):', nftMeta, 'contractAddress:', contractAddress, 'id:', id)
    toast.success('Form submitted successfully!')
  }

  const { ethereum } = useWeb3()
  const [nftURI, setNftURI] = useState('')
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: '',
    description: '',
    image: '',
    attributes: [
      { trait_type: 'membershipLevel', value: '' },
      { trait_type: 'accessLevel', value: '' },
      { trait_type: 'resourceUnlockScore', value: '' },
    ],
  })

  const handleSimpleFormSubmit = (data: any) => {
    console.log('Simple Form Data:', data)
    toast.success('Form submitted successfully!')
  }

  const createNft = async () => {
    try {
      const messageToSign = await axios.get('/api/verify')
      const accounts = (await ethereum?.request({ method: 'eth_requestAccounts' })) as string[]
      const account = accounts[0]
      const signedData = await ethereum?.request({
        method: 'personal_sign',
        params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id],
      })
      await axios.post('/api/verify', { address: account, signature: signedData, nft: nftMeta })
      toast.success('NFT created successfully!')
    } catch (error) {
      console.error('Error creating NFT:', error)
      toast.error('Error creating NFT!')
    }
  }

  return (
    <div className="min-h-screen bg-blackbrown">
      <Navbar />

      {/* Hero */}
      <section className="relative border-b border-primary/10 bg-gradient-to-b from-darkbrown/40 to-transparent">
        <div className="containerpadding container mx-auto pt-24 sm:pt-28 lg:pt-32 pb-12 lg:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary/80 text-sm font-medium uppercase tracking-widest mb-3">
              Heritage NFT
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
              Create your NFT
            </h1>
            <p className="mt-4 text-primary/70 text-lg sm:text-xl">
              Mint a digital ownership token and unlock community access. Fill in the details below to get started.
            </p>
            
            
          </div>
        </div>
      </section>

      {/* Form - full width, no side empty space */}
      <section className="w-full  -mt-2 px-2 sm:px-4">
        <div className="w-full">
          {formType === 'full' ? (
            <NFTForm onSubmit={handleFullFormSubmit} />
          ) : (
            <SimpleNFTForm onSubmit={handleSimpleFormSubmit} />
          )}
        </div>
      </section>

      <QRcode />
    </div>
  )
}

export default Page
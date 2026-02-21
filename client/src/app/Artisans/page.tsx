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
function page() {
  const [formType, setFormType] = useState('full')
  const handleFullFormSubmit = (data: any) => {
    const { contractAddress, id, ...nftMeta } = data
    console.log('Full Form Data (meta):', nftMeta)
    console.log('contractAddress:', contractAddress)
    console.log('id:', id)
    alert(`Form submitted. contractAddress: ${contractAddress ?? '—'}, id: ${id ?? '—'}`)
    toast.success('Form submitted successfully!')
  }
  const { ethereum } = useWeb3()
  const [nftURI, setNftURI] = useState('')
  const [hasUsedURI, setHasUsedURI] = useState(false);
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: '',
    description: '',
    image: '',
    attributes: [
      { trait_type: "attack", value: "0" },
      { trait_type: "health", value: "0" },
      { trait_type: "speed", value: "0" },
    ],
  });

  const handleSimpleFormSubmit = (data: any) => {
    console.log('Simple Form Data:', data)
    toast.success('Form submitted successfully!')
  }

  const createNft = async () => {
    try {
      const messageToSign = await axios.get("/api/verify");
      const accounts = await ethereum?.request({ method: 'eth_requestAccounts' }) as string[];
      const account = accounts[0];

      const signedData = await ethereum?.request({ 
        method: 'personal_sign', 
        params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id] 
      })

      await axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: nftMeta,
      })
      console.log(signedData)
      toast.success('NFT created successfully!')
    }
    catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Error creating NFT!')
      }
  }
  return (
    <div className="bg-blackbrown min-h-screen">
      <Navbar />
      <div className="containerpadding container mx-auto pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8 mt-[200px]">
        
        {/* Form Type Toggle */}
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Form Type</h3>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setFormType('full')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  formType === 'full' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Full Form
              </button>
              <button
                onClick={() => setFormType('simple')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  formType === 'simple' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Simple Form
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Forms */}
        {formType === 'full' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl">Full NFT Form</h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:mt-4">
                Complete form with all NFT details
              </p>
            </div>
            <NFTForm onSubmit={handleFullFormSubmit} />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl">Simple NFT Form</h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:mt-4">
                Simple form with URL link and price
              </p>
            </div>
            <SimpleNFTForm onSubmit={handleSimpleFormSubmit} />
          </div>
        )}
      </div>
      <QRcode />
    </div>
  )
}

export default page
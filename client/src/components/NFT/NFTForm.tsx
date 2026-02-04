'use client'
import React, { useState } from 'react'
import { NftMeta } from '../../../types/nft'
import axios from 'axios'

/** Form state: image can be a File during input, or string (URL) */
type FormNftMeta = Omit<NftMeta, 'image'> & { image: string | File | null }

interface NFTFormProps {
  onSubmit: (data: any) => void
}

const initialMeta: FormNftMeta = {
  name: '',
  description: '',
  image: '',
  attributes: [
    { trait_type: 'health', value: '0' },
    { trait_type: 'attack', value: '0' },
    { trait_type: 'speed', value: '0' }
  ]
}

function NFTForm({ onSubmit }: NFTFormProps) {
  const [nftURI, setNftURI] = useState('');
  const [hasUsedURI, setHasUsedURI] = useState(false);
  const [nftMeta, setNftMeta] = useState<FormNftMeta>(initialMeta)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNftMeta(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNftMeta(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.trait_type === name ? { ...attr, value } : attr
      )
    }))
  }

  const getAttr = (traitType: string) =>
    nftMeta.attributes.find(a => a.trait_type === traitType)?.value ?? ''

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNftMeta(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(nftMeta)
    setNftMeta(initialMeta)
  }

  const createNFT = async () => {
    try {
      const messageToSign = await axios.get("/api/verify");
      console.log(messageToSign.data)
    }
    catch (error) {
      console.error('Error creating NFT:', error)
    }
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create NFT Card</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
          value={nftMeta.name}
            type="text"
            id="name"
            name="name"
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter NFT name"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
          value={nftMeta.description}
            id="description"
            name="description"
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter NFT description"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image Upload
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {nftMeta.image && typeof nftMeta.image !== 'string' && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {nftMeta.image.name}
            </p>
          )}
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="attack" className="block text-sm font-medium text-gray-700 mb-1">
              Attack
            </label>
            <input
              type="number"
              id="attack"
              name="attack"
              value={getAttr('attack')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="40"
            />
          </div>
          <div>
            <label htmlFor="health" className="block text-sm font-medium text-gray-700 mb-1">
              Health
            </label>
            <input
              type="number"
              id="health"
              name="health"
              value={getAttr('health')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
            />
          </div>
          <div>
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-1">
              Speed
            </label>
            <input
              type="number"
              id="speed"
              name="speed"
              value={getAttr('speed')}
              onChange={handleAttributeChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="30"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          List
        </button>
      </form>
    </div>
  )
}

export default NFTForm

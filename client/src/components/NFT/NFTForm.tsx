'use client'
import React, { useState } from 'react'

interface NFTFormProps {
  onSubmit: (data: any) => void
}

function NFTForm({ onSubmit }: NFTFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    health: '',
    attack: '',
    speed: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      name: '',
      description: '',
      image: null,
      health: '',
      attack: '',
      speed: ''
    })
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
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
            id="description"
            name="description"
            value={formData.description}
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
          {formData.image && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {formData.image.name}
            </p>
          )}
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="health" className="block text-sm font-medium text-gray-700 mb-1">
              Health
            </label>
            <input
              type="number"
              id="health"
              name="health"
              value={formData.health}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="attack" className="block text-sm font-medium text-gray-700 mb-1">
              Attack
            </label>
            <input
              type="number"
              id="attack"
              name="attack"
              value={formData.attack}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="40"
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
              value={formData.speed}
              onChange={handleInputChange}
              required
              min="1"
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
          Save NFT Card
        </button>
      </form>
    </div>
  )
}

export default NFTForm

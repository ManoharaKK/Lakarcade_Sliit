'use client'
import React, { useState } from 'react'

function NFTProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    collection: '',
    rarity: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/api/nft-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image,
          collectionName: formData.collection, // Map collection to collectionName
          rarity: formData.rarity,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to save NFT product: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to save NFT product: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('NFT Product saved successfully!')
        setFormData({ name: '', description: '', price: '', image: '', collection: '', rarity: '' })
      } else {
        alert(`Failed to save NFT product: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving NFT product:', error)
      alert('Failed to save NFT product. Please check your connection.')
    }
  }

  return (
    <div>
      <h1 className='text-blackbrown title mb-6'>NFT Product Management</h1>
      
      <div className='bg-primary border border-lightbrown rounded p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-blackbrown font-medium mb-2'>Product Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter NFT product name'
                required
              />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter product description'
                required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Price</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter price'
                required
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Collection</label>
              <input
                type='text'
                name='collection'
                value={formData.collection}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter collection name'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Image URL</label>
              <input
                type='text'
                name='image'
                value={formData.image}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter image URL'
                required
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Rarity</label>
              <select
                name='rarity'
                value={formData.rarity}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                required
              >
                <option value=''>Select rarity</option>
                <option value='Common'>Common</option>
                <option value='Rare'>Rare</option>
                <option value='Epic'>Epic</option>
                <option value='Legendary'>Legendary</option>
                <option value='Mythic'>Mythic</option>
              </select>
            </div>
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
            >
              Save NFT Product
            </button>
            <button
              type='button'
              onClick={() => setFormData({ name: '', description: '', price: '', image: '', collection: '', rarity: '' })}
              className='bg-lightbrown text-blackbrown px-6 py-2 rounded hover:bg-lightbrown/80 transition-colors font-semibold'
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NFTProduct


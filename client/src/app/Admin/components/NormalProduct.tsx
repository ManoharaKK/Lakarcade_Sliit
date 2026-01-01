'use client'
import React, { useState } from 'react'

function NormalProduct() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    earlyPrice: '',
    discountPercentage: '',
    salesEndDate: '',
    localTaxesIncluded: false,
    material: '',
    dimensions: '',
    weight: '',
    color: '',
    craftTechnique: '',
    origin: '',
    authenticity: '',
    careInstruction: '',
    shipping: '',
    returnsDescription: '',
    images: '',
    artisanStory: '',
    selectVillage: '',
    review: {
      averageRating: '',
      totalReviews: '',
      reviews: []
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (name.startsWith('review.')) {
      const reviewField = name.split('.')[1]
      setFormData({
        ...formData,
        review: {
          ...formData.review,
          [reviewField]: value
        }
      })
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Prepare data for API
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        earlyPrice: formData.earlyPrice ? parseFloat(formData.earlyPrice) : undefined,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
        salesEndDate: formData.salesEndDate ? new Date(formData.salesEndDate).toISOString() : undefined,
        images: formData.images ? formData.images.split(',').map(img => img.trim()).filter(img => img) : [],
        careInstruction: formData.careInstruction ? formData.careInstruction.split('\n').filter(line => line.trim()) : [],
        review: {
          averageRating: formData.review.averageRating ? parseFloat(formData.review.averageRating) : 0,
          totalReviews: formData.review.totalReviews ? parseInt(formData.review.totalReviews) : 0,
          reviews: []
        }
      }

      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to save product: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to save product: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Product saved successfully!')
        setFormData({
          title: '', subtitle: '', price: '', earlyPrice: '', discountPercentage: '',
          salesEndDate: '', localTaxesIncluded: false, material: '', dimensions: '', weight: '',
          color: '', craftTechnique: '', origin: '', authenticity: '', careInstruction: '',
          shipping: '', returnsDescription: '', images: '', artisanStory: '', selectVillage: '',
          review: { averageRating: '', totalReviews: '', reviews: [] }
        })
      } else {
        alert(`Failed to save product: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please check your connection.')
    }
  }

  return (
    <div>
      <h1 className='text-blackbrown title mb-6'>Normal Product Management</h1>
      
      <div className='bg-primary border border-lightbrown rounded p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Title</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter product title'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Subtitle</label>
              <input
                type='text'
                name='subtitle'
                value={formData.subtitle}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter product subtitle'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Price</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Current price'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Early Price</label>
              <input
                type='number'
                name='earlyPrice'
                value={formData.earlyPrice}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Early price'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Discount %</label>
              <input
                type='number'
                name='discountPercentage'
                value={formData.discountPercentage}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Discount percentage'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Sales End Date</label>
              <input
                type='datetime-local'
                name='salesEndDate'
                value={formData.salesEndDate}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              />
            </div>

            <div className='flex items-center pt-8'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  name='localTaxesIncluded'
                  checked={formData.localTaxesIncluded}
                  onChange={handleChange}
                  className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown cursor-pointer custom-checkbox'
                />
                <span className='text-blackbrown font-medium'>Local Taxes Included</span>
              </label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Material</label>
              <input
                type='text'
                name='material'
                value={formData.material}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter material'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Dimensions</label>
              <input
                type='text'
                name='dimensions'
                value={formData.dimensions}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='e.g., 20cm x 15cm x 10cm'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Weight</label>
              <input
                type='text'
                name='weight'
                value={formData.weight}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter weight'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Color</label>
              <input
                type='text'
                name='color'
                value={formData.color}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter color'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Craft Technique</label>
              <input
                type='text'
                name='craftTechnique'
                value={formData.craftTechnique}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter craft technique'
              />
            </div>
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Origin</label>
            <input
              type='text'
              name='origin'
              value={formData.origin}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter origin'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Authenticity</label>
            <input
              type='text'
              name='authenticity'
              value={formData.authenticity}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='e.g., Verified with QR code and artisan signature'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Care Instructions (one per line)</label>
            <textarea
              name='careInstruction'
              value={formData.careInstruction}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter care instructions (one per line)'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Shipping Information</label>
            <textarea
              name='shipping'
              value={formData.shipping}
              onChange={handleChange}
              rows={2}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter shipping information'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Returns Description</label>
            <textarea
              name='returnsDescription'
              value={formData.returnsDescription}
              onChange={handleChange}
              rows={2}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter returns policy description'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Images (comma-separated URLs)</label>
            <textarea
              name='images'
              value={formData.images}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter image URLs separated by commas'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Artisan Story</label>
            <textarea
              name='artisanStory'
              value={formData.artisanStory}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter artisan story'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Select Village</label>
            <input
              type='text'
              name='selectVillage'
              value={formData.selectVillage}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter village name'
            />
          </div>

          <div className='border-t border-lightbrown pt-4'>
            <h3 className='text-blackbrown font-semibold mb-4'>Review Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-blackbrown font-medium mb-2'>Average Rating</label>
                <input
                  type='number'
                  name='review.averageRating'
                  value={formData.review.averageRating}
                  onChange={handleChange}
                  min='0'
                  max='5'
                  step='0.1'
                  className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  placeholder='0.0 - 5.0'
                />
              </div>

              <div>
                <label className='block text-blackbrown font-medium mb-2'>Total Reviews</label>
                <input
                  type='number'
                  name='review.totalReviews'
                  value={formData.review.totalReviews}
                  onChange={handleChange}
                  min='0'
                  className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  placeholder='Enter total number of reviews'
                />
              </div>
            </div>
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
            >
              Save Product
            </button>
            <button
              type='button'
              onClick={() => setFormData({
                title: '', subtitle: '', price: '', earlyPrice: '', discountPercentage: '',
                salesEndDate: '', localTaxesIncluded: false, material: '', dimensions: '', weight: '',
                color: '', craftTechnique: '', origin: '', authenticity: '', careInstruction: '',
                shipping: '', returnsDescription: '', images: '', artisanStory: '', selectVillage: '',
                review: { averageRating: '', totalReviews: '', reviews: [] }
              })}
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

export default NormalProduct


'use client'
import React, { useState } from 'react'

function ArtisansData() {
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    specialty: '',
    experience: '',
    bio: '',
    profileImage: '',
    products: '',
    awards: '',
    contact: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/api/artisans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          experience: formData.experience ? parseInt(formData.experience) : undefined,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to save artisan data: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to save artisan data: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Artisan data saved successfully!')
        setFormData({
          name: '', village: '', specialty: '', experience: '', bio: '',
          profileImage: '', products: '', awards: '', contact: ''
        })
      } else {
        alert(`Failed to save artisan data: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving artisan data:', error)
      alert('Failed to save artisan data. Please check your connection.')
    }
  }

  return (
    <div>
      <h1 className='text-blackbrown title mb-6'>Artisans Data Management</h1>
      
      <div className='bg-primary border border-lightbrown rounded p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Artisan Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter artisan name'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Village</label>
              <input
                type='text'
                name='village'
                value={formData.village}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter village name'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Specialty</label>
              <input
                type='text'
                name='specialty'
                value={formData.specialty}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='e.g., Wood carving, Pottery, Batik'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Years of Experience</label>
              <input
                type='number'
                name='experience'
                value={formData.experience}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter years of experience'
              />
            </div>
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Biography</label>
            <textarea
              name='bio'
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter artisan biography'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Profile Image URL</label>
            <input
              type='text'
              name='profileImage'
              value={formData.profileImage}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter profile image URL'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Products (comma-separated)</label>
            <input
              type='text'
              name='products'
              value={formData.products}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter product names separated by commas'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Awards & Recognition</label>
            <textarea
              name='awards'
              value={formData.awards}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter awards and recognition (one per line)'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Contact Information</label>
            <input
              type='text'
              name='contact'
              value={formData.contact}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter contact information'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
            >
              Save Artisan Data
            </button>
            <button
              type='button'
              onClick={() => setFormData({
                name: '', village: '', specialty: '', experience: '', bio: '',
                profileImage: '', products: '', awards: '', contact: ''
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

export default ArtisansData


'use client'
import React, { useState } from 'react'

function VillageData() {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    famousFor: '',
    locationName: '',
    locationImage: '',
    description: '',
    makingVideo: '',
    impactDescription: '',
    impactImages: ''
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
      const response = await fetch('http://localhost:4000/api/villages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          region: formData.region,
          famousFor: formData.famousFor,
          locationName: formData.locationName,
          locationImage: formData.locationImage,
          description: formData.description,
          makingVideo: formData.makingVideo,
          impactDescription: formData.impactDescription,
          impactImages: formData.impactImages,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to save village data: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to save village data: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Village data saved successfully!')
        setFormData({
          name: '', region: '', famousFor: '', locationName: '', locationImage: '',
          description: '', makingVideo: '', impactDescription: '', impactImages: ''
        })
      } else {
        alert(`Failed to save village data: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving village data:', error)
      alert('Failed to save village data. Please check your connection.')
    }
  }

  return (
    <div>
      <h1 className='text-blackbrown title mb-6'>Village Data Management</h1>
      
      <div className='bg-primary border border-lightbrown rounded p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Village Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter village name'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Region</label>
              <input
                type='text'
                name='region'
                value={formData.region}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter region'
              />
            </div>
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Famous For</label>
            <input
              type='text'
              name='famousFor'
              value={formData.famousFor}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='What is this village famous for?'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Location Name</label>
              <input
                type='text'
                name='locationName'
                value={formData.locationName}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter location name'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Location Image URL</label>
              <input
                type='text'
                name='locationImage'
                value={formData.locationImage}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter location image URL'
              />
            </div>
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Description (one paragraph per line)</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter description paragraphs (one per line)'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Making Video URL</label>
            <input
              type='text'
              name='makingVideo'
              value={formData.makingVideo}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter video URL or path'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Impact Description (one paragraph per line)</label>
            <textarea
              name='impactDescription'
              value={formData.impactDescription}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter impact description paragraphs (one per line)'
            />
          </div>

          <div>
            <label className='block text-blackbrown font-medium mb-2'>Impact Images (comma-separated URLs)</label>
            <textarea
              name='impactImages'
              value={formData.impactImages}
              onChange={handleChange}
              rows={2}
              className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              placeholder='Enter impact image URLs separated by commas'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
            >
              Save Village Data
            </button>
            <button
              type='button'
              onClick={() => setFormData({
                name: '', region: '', famousFor: '', locationName: '', locationImage: '',
                description: '', makingVideo: '', impactDescription: '', impactImages: ''
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

export default VillageData


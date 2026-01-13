'use client'
import React, { useState, useEffect } from 'react'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'

interface VillageDataItem {
  _id: string
  id: string
  name: string
  region: string
  famousFor: string
  location: {
    name: string
    image: string
  }
  createdAt: string
  updatedAt: string
}

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
  const [villages, setVillages] = useState<VillageDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVillage, setSelectedVillage] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [locationImageFile, setLocationImageFile] = useState<File | null>(null)
  const [locationImagePreview, setLocationImagePreview] = useState<string>('')
  const [locationIsDragging, setLocationIsDragging] = useState(false)
  const [impactImageFiles, setImpactImageFiles] = useState<File[]>([])
  const [impactImagePreviews, setImpactImagePreviews] = useState<string[]>([])
  const [impactIsDragging, setImpactIsDragging] = useState(false)

  useEffect(() => {
    fetchVillages()
  }, [])

  const fetchVillages = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:4000/api/villages')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setVillages(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching villages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this village?')) return

    try {
      const response = await fetch(`http://localhost:4000/api/villages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Village deleted successfully!')
        fetchVillages()
      } else {
        alert('Failed to delete village')
      }
    } catch (error) {
      console.error('Error deleting village:', error)
      alert('Failed to delete village. Please check your connection.')
    }
  }

  const handleEditClick = (village: any) => {
    setSelectedVillage(village)
    setIsEditMode(true)
    setEditData({
      name: village.name || '',
      region: village.region || '',
      famousFor: village.famousFor || '',
      locationName: village.location?.name || '',
      locationImage: village.location?.image || '',
      description: Array.isArray(village.description) ? village.description.join('\n') : '',
      makingVideo: village.makingVideo || '',
      impactDescription: Array.isArray(village.impactDescription) ? village.impactDescription.join('\n') : '',
      impactImages: Array.isArray(village.impactImages) ? village.impactImages.join(', ') : ''
    })
    setShowModal(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedVillage) return

    try {
      const villageData = {
        name: editData.name,
        region: editData.region,
        famousFor: editData.famousFor,
        locationName: editData.locationName,
        locationImage: editData.locationImage,
        description: editData.description ? editData.description.split('\n').filter((line: string) => line.trim()) : [],
        makingVideo: editData.makingVideo,
        impactDescription: editData.impactDescription ? editData.impactDescription.split('\n').filter((line: string) => line.trim()) : [],
        impactImages: editData.impactImages ? editData.impactImages.split(',').map((img: string) => img.trim()).filter((img: string) => img) : []
      }

      const response = await fetch(`http://localhost:4000/api/villages/${selectedVillage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(villageData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to update village: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to update village: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Village updated successfully!')
        setIsEditMode(false)
        fetchVillages()
        setSelectedVillage(data.data)
      } else {
        alert(`Failed to update village: ${data.message}`)
      }
    } catch (error) {
      console.error('Error updating village:', error)
      alert('Failed to update village. Please check your connection.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size must be less than 5MB'))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          const maxDimension = 1920
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension
              width = maxDimension
            } else {
              width = (width / height) * maxDimension
              height = maxDimension
            }
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
          resolve(compressedBase64)
        }
        img.onerror = reject
        img.src = base64String
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleLocationImageSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const compressedBase64 = await compressImage(file)
        setLocationImageFile(file)
        setLocationImagePreview(compressedBase64)
        setFormData({
          ...formData,
          locationImage: compressedBase64
        })
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to process image')
      }
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleLocationFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleLocationImageSelect(file)
    }
  }

  const handleLocationDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setLocationIsDragging(true)
  }

  const handleLocationDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setLocationIsDragging(false)
  }

  const handleLocationDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setLocationIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleLocationImageSelect(file)
    }
  }

  const handleImpactImagesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length === 0) {
      alert('Please select valid image files')
      return
    }

    try {
      const compressedImages = await Promise.all(validFiles.map(file => compressImage(file)))
      setImpactImageFiles(validFiles)
      setImpactImagePreviews(compressedImages)
      
      setFormData({
        ...formData,
        impactImages: compressedImages.join(',')
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process images')
    }
  }

  const handleImpactFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImpactImagesSelect(files)
    }
  }

  const handleImpactDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setImpactIsDragging(true)
  }

  const handleImpactDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setImpactIsDragging(false)
  }

  const handleImpactDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setImpactIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImpactImagesSelect(files)
    }
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
        setLocationImageFile(null)
        setLocationImagePreview('')
        setImpactImageFiles([])
        setImpactImagePreviews([])
        fetchVillages() // Refresh the table
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
              <label className='block text-blackbrown font-medium mb-2'>Location Image</label>
              <div
                onDragOver={handleLocationDragOver}
                onDragLeave={handleLocationDragLeave}
                onDrop={handleLocationDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  locationIsDragging
                    ? 'border-secondarybrown bg-lightbrown/20'
                    : 'border-lightbrown bg-primary hover:border-secondarybrown/50'
                }`}
              >
                {locationImagePreview ? (
                  <div className='space-y-4'>
                    <img
                      src={locationImagePreview}
                      alt='Preview'
                      className='mx-auto max-w-full max-h-64 object-contain rounded border border-lightbrown'
                    />
                    <div className='flex gap-2 justify-center'>
                      <button
                        type='button'
                        onClick={() => {
                          setLocationImageFile(null)
                          setLocationImagePreview('')
                          setFormData({ ...formData, locationImage: '' })
                        }}
                        className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm'
                      >
                        Remove Image
                      </button>
                      <label className='bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors text-sm cursor-pointer'>
                        Change Image
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleLocationFileInputChange}
                          className='hidden'
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='text-blackbrown'>
                      <svg
                        className='mx-auto h-12 w-12 text-lightbrown'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='mt-2 text-sm'>
                        <span className='font-semibold text-secondarybrown'>Click to upload</span> or drag and drop
                      </p>
                      <p className='text-xs text-blackbrown/70 mt-1'>PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <label className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold cursor-pointer inline-block'>
                      Select Image
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleLocationFileInputChange}
                        className='hidden'
                      />
                    </label>
                  </div>
                )}
              </div>
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
            <label className='block text-blackbrown font-medium mb-2'>Impact Images</label>
            <div
              onDragOver={handleImpactDragOver}
              onDragLeave={handleImpactDragLeave}
              onDrop={handleImpactDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                impactIsDragging
                  ? 'border-secondarybrown bg-lightbrown/20'
                  : 'border-lightbrown bg-primary hover:border-secondarybrown/50'
              }`}
            >
              {impactImagePreviews.length > 0 ? (
                <div className='space-y-4'>
                  <div className='grid grid-cols-3 gap-2'>
                    {impactImagePreviews.map((preview, index) => (
                      <div key={index} className='relative'>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className='w-full h-32 object-cover rounded border border-lightbrown'
                        />
                        <button
                          type='button'
                          onClick={() => {
                            const newPreviews = impactImagePreviews.filter((_, i) => i !== index)
                            const newFiles = impactImageFiles.filter((_, i) => i !== index)
                            setImpactImagePreviews(newPreviews)
                            setImpactImageFiles(newFiles)
                            setFormData({
                              ...formData,
                              impactImages: newPreviews.join(',')
                            })
                          }}
                          className='absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className='flex gap-2 justify-center'>
                    <label className='bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors text-sm cursor-pointer'>
                      Add More Images
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleImpactFileInputChange}
                        className='hidden'
                      />
                    </label>
                    <button
                      type='button'
                      onClick={() => {
                        setImpactImageFiles([])
                        setImpactImagePreviews([])
                        setFormData({ ...formData, impactImages: '' })
                      }}
                      className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm'
                    >
                      Remove All
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='text-blackbrown'>
                    <svg
                      className='mx-auto h-12 w-12 text-lightbrown'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <p className='mt-2 text-sm'>
                      <span className='font-semibold text-secondarybrown'>Click to upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-blackbrown/70 mt-1'>PNG, JPG, GIF up to 5MB each (multiple images allowed)</p>
                  </div>
                  <label className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold cursor-pointer inline-block'>
                    Select Images
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleImpactFileInputChange}
                      className='hidden'
                    />
                  </label>
                </div>
              )}
            </div>
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

      {/* Data Table */}
      <div className='mt-8 bg-primary border border-lightbrown rounded p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-blackbrown text-2xl font-semibold'>All Villages</h2>
          <button
            onClick={fetchVillages}
            className='bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className='text-blackbrown text-center py-4'>Loading...</p>
        ) : villages.length === 0 ? (
          <p className='text-blackbrown text-center py-4'>No villages found. Create one above.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-lightbrown'>
              <thead>
                <tr className='bg-lightbrown'>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Name</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Region</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Famous For</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Location</th>
                  <th className='border border-lightbrown px-2 py-2 text-left text-blackbrown font-semibold w-24'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {villages.map((village) => (
                  <tr key={village._id} className='hover:bg-lightbrown/20'>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{village.name}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{village.region}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{village.famousFor}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{village.location?.name || '-'}</td>
                    <td className='border border-lightbrown px-2 py-2'>
                      <div className='flex gap-1 justify-center'>
                        <button
                          onClick={() => {
                            setSelectedVillage(village)
                            setIsEditMode(false)
                            setShowModal(true)
                          }}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='View Details'
                        >
                          <FiEye className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleEditClick(village)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Edit Village'
                        >
                          <FiEdit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(village.id)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Delete Village'
                        >
                          <FiTrash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedVillage && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
          <div className='bg-primary border border-lightbrown rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-blackbrown text-2xl font-semibold'>{isEditMode ? 'Edit Village' : 'Village Details'}</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setIsEditMode(false)
                  setEditData({})
                }}
                className='text-blackbrown hover:text-secondarybrown text-2xl font-bold'
              >
                ×
              </button>
            </div>
            
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Village Name</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='name'
                      value={editData.name}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedVillage.name || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Region</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='region'
                      value={editData.region}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedVillage.region || '-'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Famous For</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='famousFor'
                    value={editData.famousFor}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedVillage.famousFor || '-'}</p>
                )}
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Location Name</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='locationName'
                      value={editData.locationName}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedVillage.location?.name || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Location Image URL</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='locationImage'
                      value={editData.locationImage}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    selectedVillage.location?.image && (
                      <div>
                        <img src={selectedVillage.location.image} alt={selectedVillage.location.name} className='w-full max-w-md h-auto rounded border border-lightbrown' />
                      </div>
                    )
                  )}
                </div>
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Description (one paragraph per line)</label>
                {isEditMode ? (
                  <textarea
                    name='description'
                    value={editData.description}
                    onChange={handleEditChange}
                    rows={4}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='One paragraph per line'
                  />
                ) : (
                  selectedVillage.description && selectedVillage.description.length > 0 && (
                    <div className='bg-lightbrown/20 p-2 rounded space-y-2'>
                      {(Array.isArray(selectedVillage.description) ? selectedVillage.description : []).map((para: string, index: number) => (
                        <p key={index} className='text-blackbrown'>{para}</p>
                      ))}
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Making Video URL</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='makingVideo'
                    value={editData.makingVideo}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedVillage.makingVideo && (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedVillage.makingVideo}</p>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Impact Description (one paragraph per line)</label>
                {isEditMode ? (
                  <textarea
                    name='impactDescription'
                    value={editData.impactDescription}
                    onChange={handleEditChange}
                    rows={3}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='One paragraph per line'
                  />
                ) : (
                  selectedVillage.impactDescription && selectedVillage.impactDescription.length > 0 && (
                    <div className='bg-lightbrown/20 p-2 rounded space-y-2'>
                      {(Array.isArray(selectedVillage.impactDescription) ? selectedVillage.impactDescription : []).map((para: string, index: number) => (
                        <p key={index} className='text-blackbrown'>{para}</p>
                      ))}
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Impact Images (comma-separated URLs)</label>
                {isEditMode ? (
                  <textarea
                    name='impactImages'
                    value={editData.impactImages}
                    onChange={handleEditChange}
                    rows={2}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Comma-separated image URLs'
                  />
                ) : (
                  selectedVillage.impactImages && selectedVillage.impactImages.length > 0 && (
                    <div className='grid grid-cols-3 gap-2'>
                      {selectedVillage.impactImages.map((img: string, index: number) => (
                        <img key={index} src={img} alt={`Impact ${index + 1}`} className='w-full h-32 object-cover rounded border border-lightbrown' />
                      ))}
                    </div>
                  )
                )}
              </div>
              
              {isEditMode && (
                <div className='flex gap-4 pt-4'>
                  <button
                    onClick={handleSaveEdit}
                    className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false)
                      setEditData({})
                    }}
                    className='bg-lightbrown text-blackbrown px-6 py-2 rounded hover:bg-lightbrown/80 transition-colors font-semibold'
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VillageData


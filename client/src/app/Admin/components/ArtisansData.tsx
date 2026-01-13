'use client'
import React, { useState, useEffect } from 'react'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'

interface ArtisanDataItem {
  _id: string
  name: string
  village: string
  specialty: string
  experience: number
  bio: string
  profileImage: string
  products: string[]
  awards: string[]
  contact: string
  createdAt: string
  updatedAt: string
}

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
  const [artisans, setArtisans] = useState<ArtisanDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchArtisans()
  }, [])

  const fetchArtisans = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:4000/api/artisans')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setArtisans(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching artisans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artisan?')) return

    try {
      const response = await fetch(`http://localhost:4000/api/artisans/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Artisan deleted successfully!')
        fetchArtisans()
      } else {
        alert('Failed to delete artisan')
      }
    } catch (error) {
      console.error('Error deleting artisan:', error)
      alert('Failed to delete artisan. Please check your connection.')
    }
  }

  const handleEditClick = (artisan: any) => {
    setSelectedArtisan(artisan)
    setIsEditMode(true)
    setEditData({
      name: artisan.name || '',
      village: artisan.village || '',
      specialty: artisan.specialty || '',
      experience: artisan.experience || 0,
      bio: artisan.bio || '',
      profileImage: artisan.profileImage || '',
      products: Array.isArray(artisan.products) ? artisan.products.join(', ') : '',
      awards: Array.isArray(artisan.awards) ? artisan.awards.join('\n') : '',
      contact: artisan.contact || ''
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
    if (!selectedArtisan) return

    try {
      const artisanData = {
        ...editData,
        experience: editData.experience ? parseInt(editData.experience.toString()) : undefined,
        products: editData.products ? editData.products.split(',').map((p: string) => p.trim()).filter((p: string) => p) : [],
        awards: editData.awards ? editData.awards.split('\n').filter((line: string) => line.trim()) : []
      }

      const response = await fetch(`http://localhost:4000/api/artisans/${selectedArtisan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artisanData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to update artisan: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to update artisan: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Artisan updated successfully!')
        setIsEditMode(false)
        fetchArtisans()
        setSelectedArtisan(data.data)
      } else {
        alert(`Failed to update artisan: ${data.message}`)
      }
    } catch (error) {
      console.error('Error updating artisan:', error)
      alert('Failed to update artisan. Please check your connection.')
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

  const handleProfileImageSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const compressedBase64 = await compressImage(file)
        setProfileImageFile(file)
        setProfileImagePreview(compressedBase64)
        setFormData({
          ...formData,
          profileImage: compressedBase64
        })
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to process image')
      }
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleProfileImageSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleProfileImageSelect(file)
    }
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
        setProfileImageFile(null)
        setProfileImagePreview('')
        fetchArtisans() // Refresh the table
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
            <label className='block text-blackbrown font-medium mb-2'>Profile Image</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? 'border-secondarybrown bg-lightbrown/20'
                  : 'border-lightbrown bg-primary hover:border-secondarybrown/50'
              }`}
            >
              {profileImagePreview ? (
                <div className='space-y-4'>
                  <img
                    src={profileImagePreview}
                    alt='Preview'
                    className='mx-auto max-w-full max-h-64 object-contain rounded border border-lightbrown'
                  />
                  <div className='flex gap-2 justify-center'>
                    <button
                      type='button'
                      onClick={() => {
                        setProfileImageFile(null)
                        setProfileImagePreview('')
                        setFormData({ ...formData, profileImage: '' })
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
                        onChange={handleFileInputChange}
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
                      onChange={handleFileInputChange}
                      className='hidden'
                    />
                  </label>
                </div>
              )}
            </div>
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

      {/* Data Table */}
      <div className='mt-8 bg-primary border border-lightbrown rounded p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-blackbrown text-2xl font-semibold'>All Artisans</h2>
          <button
            onClick={fetchArtisans}
            className='bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className='text-blackbrown text-center py-4'>Loading...</p>
        ) : artisans.length === 0 ? (
          <p className='text-blackbrown text-center py-4'>No artisans found. Create one above.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-lightbrown'>
              <thead>
                <tr className='bg-lightbrown'>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Name</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Village</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Specialty</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Experience</th>
                  <th className='border border-lightbrown px-2 py-2 text-left text-blackbrown font-semibold w-24'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artisans.map((artisan) => (
                  <tr key={artisan._id} className='hover:bg-lightbrown/20'>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{artisan.name}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{artisan.village}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{artisan.specialty}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{artisan.experience} years</td>
                    <td className='border border-lightbrown px-2 py-2'>
                      <div className='flex gap-1 justify-center'>
                        <button
                          onClick={() => {
                            setSelectedArtisan(artisan)
                            setIsEditMode(false)
                            setShowModal(true)
                          }}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='View Details'
                        >
                          <FiEye className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleEditClick(artisan)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Edit Artisan'
                        >
                          <FiEdit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(artisan._id)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Delete Artisan'
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
      {showModal && selectedArtisan && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
          <div className='bg-primary border border-lightbrown rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-blackbrown text-2xl font-semibold'>{isEditMode ? 'Edit Artisan' : 'Artisan Details'}</h2>
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
                  <label className='block text-blackbrown font-semibold mb-1'>Name</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='name'
                      value={editData.name}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedArtisan.name || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Village</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='village'
                      value={editData.village}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedArtisan.village || '-'}</p>
                  )}
                </div>
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Specialty</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='specialty'
                      value={editData.specialty}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedArtisan.specialty || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Experience (years)</label>
                  {isEditMode ? (
                    <input
                      type='number'
                      name='experience'
                      value={editData.experience}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedArtisan.experience ? `${selectedArtisan.experience} years` : '-'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Biography</label>
                {isEditMode ? (
                  <textarea
                    name='bio'
                    value={editData.bio}
                    onChange={handleEditChange}
                    rows={4}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedArtisan.bio && (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded whitespace-pre-wrap'>{selectedArtisan.bio}</p>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Profile Image URL</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='profileImage'
                    value={editData.profileImage}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedArtisan.profileImage && (
                    <div>
                      <img src={selectedArtisan.profileImage} alt={selectedArtisan.name} className='w-full max-w-md h-auto rounded border border-lightbrown' />
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Products (comma-separated)</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='products'
                    value={editData.products}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Comma-separated product names'
                  />
                ) : (
                  selectedArtisan.products && selectedArtisan.products.length > 0 && (
                    <div className='bg-lightbrown/20 p-2 rounded'>
                      <ul className='list-disc list-inside text-blackbrown space-y-1'>
                        {selectedArtisan.products.map((product: string, index: number) => (
                          <li key={index}>{product}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Awards & Recognition (one per line)</label>
                {isEditMode ? (
                  <textarea
                    name='awards'
                    value={editData.awards}
                    onChange={handleEditChange}
                    rows={3}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='One award per line'
                  />
                ) : (
                  selectedArtisan.awards && selectedArtisan.awards.length > 0 && (
                    <div className='bg-lightbrown/20 p-2 rounded'>
                      <ul className='list-disc list-inside text-blackbrown space-y-1'>
                        {selectedArtisan.awards.map((award: string, index: number) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Contact Information</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='contact'
                    value={editData.contact}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedArtisan.contact && (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedArtisan.contact}</p>
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

export default ArtisansData


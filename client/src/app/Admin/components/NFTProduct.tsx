'use client'
import React, { useState, useEffect } from 'react'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'

interface NFTProductData {
  _id: string
  name: string
  description: string
  price: number
  image: string
  collectionName: string
  rarity: string
  createdAt: string
  updatedAt: string
}

function NFTProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    collection: '',
    rarity: ''
  })
  const [products, setProducts] = useState<NFTProductData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<NFTProductData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:4000/api/nft-products')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProducts(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`http://localhost:4000/api/nft-products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Product deleted successfully!')
        fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please check your connection.')
    }
  }

  const handleEditClick = (product: NFTProductData) => {
    setSelectedProduct(product)
    setIsEditMode(true)
    setEditData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      image: product.image || '',
      collectionName: product.collectionName || '',
      rarity: product.rarity || ''
    })
    setShowModal(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`http://localhost:4000/api/nft-products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          price: parseFloat(editData.price.toString())
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          alert(`Failed to update product: ${errorData.message || 'Server error'}`)
        } catch {
          alert(`Failed to update product: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Product updated successfully!')
        setIsEditMode(false)
        fetchProducts()
        setSelectedProduct(data.data)
      } else {
        alert(`Failed to update product: ${data.message}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please check your connection.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please compress the image or choose a smaller file.')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        
        // Compress image if it's too large
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Resize if image is too large (max 1920x1920)
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
          
          // Convert to base64 with quality compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
          setImagePreview(compressedBase64)
          setFormData({
            ...formData,
            image: compressedBase64
          })
        }
        img.src = base64String
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
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
      handleImageSelect(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formData.image) {
        alert('Please upload an image')
        return
      }

      const response = await fetch('http://localhost:4000/api/nft-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image, // This will be the base64 string
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
        setImageFile(null)
        setImagePreview('')
        fetchProducts() // Refresh the table
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
              <label className='block text-blackbrown font-medium mb-2'>Image</label>
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
                {imagePreview ? (
                  <div className='space-y-4'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='mx-auto max-w-full max-h-64 object-contain rounded border border-lightbrown'
                    />
                    <div className='flex gap-2 justify-center'>
                      <button
                        type='button'
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview('')
                          setFormData({ ...formData, image: '' })
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
                      <p className='text-xs text-blackbrown/70 mt-1'>PNG, JPG, GIF up to 10MB</p>
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

      {/* Data Table */}
      <div className='mt-8 bg-primary border border-lightbrown rounded p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-blackbrown text-2xl font-semibold'>All NFT Products</h2>
          <button
            onClick={fetchProducts}
            className='bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className='text-blackbrown text-center py-4'>Loading...</p>
        ) : products.length === 0 ? (
          <p className='text-blackbrown text-center py-4'>No products found. Create one above.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-lightbrown'>
              <thead>
                <tr className='bg-lightbrown'>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Name</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Collection</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Rarity</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Price</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Image</th>
                  <th className='border border-lightbrown px-2 py-2 text-left text-blackbrown font-semibold w-24'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className='hover:bg-lightbrown/20'>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{product.name}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{product.collectionName}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{product.rarity}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>${product.price}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>
                      {product.image && (
                        <img src={product.image} alt={product.name} className='w-16 h-16 object-cover rounded' />
                      )}
                    </td>
                    <td className='border border-lightbrown px-2 py-2'>
                      <div className='flex gap-1 justify-center'>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsEditMode(false)
                            setShowModal(true)
                          }}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='View Details'
                        >
                          <FiEye className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleEditClick(product)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Edit Product'
                        >
                          <FiEdit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Delete Product'
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
      {showModal && selectedProduct && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
          <div className='bg-primary border border-lightbrown rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-blackbrown text-2xl font-semibold'>{isEditMode ? 'Edit NFT Product' : 'NFT Product Details'}</h2>
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
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Product Name</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='name'
                    value={editData.name}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.name}</p>
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Description</label>
                {isEditMode ? (
                  <textarea
                    name='description'
                    value={editData.description}
                    onChange={handleEditChange}
                    rows={4}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.description}</p>
                )}
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Price</label>
                  {isEditMode ? (
                    <input
                      type='number'
                      name='price'
                      value={editData.price}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>${selectedProduct.price}</p>
                  )}
                </div>
                
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Collection</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='collectionName'
                      value={editData.collectionName}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.collectionName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Rarity</label>
                {isEditMode ? (
                  <select
                    name='rarity'
                    value={editData.rarity}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  >
                    <option value='Common'>Common</option>
                    <option value='Rare'>Rare</option>
                    <option value='Epic'>Epic</option>
                    <option value='Legendary'>Legendary</option>
                    <option value='Mythic'>Mythic</option>
                  </select>
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.rarity}</p>
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Image URL</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='image'
                    value={editData.image}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedProduct.image && (
                    <div>
                      <img src={selectedProduct.image} alt={selectedProduct.name} className='w-full max-w-md h-auto rounded border border-lightbrown' />
                    </div>
                  )
                )}
              </div>
              
              {!isEditMode && (
                <div className='grid grid-cols-2 gap-4 text-sm text-blackbrown/70'>
                  <div>
                    <label className='block font-semibold mb-1'>Created At</label>
                    <p>{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className='block font-semibold mb-1'>Updated At</label>
                    <p>{new Date(selectedProduct.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              
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

export default NFTProduct


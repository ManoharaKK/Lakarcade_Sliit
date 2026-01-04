'use client'
import React, { useState, useEffect } from 'react'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import { HiQrcode } from 'react-icons/hi'
import QRcode from '../../../components/QR/QRcode'

interface ProductData {
  _id: string
  id: string
  title: string
  subtitle: string
  price: number
  images: string[]
  createdAt: string
  updatedAt: string
}

function NormalProduct() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    branches: '',
    price: '',
    earlyPrice: '',
    discountPercentage: '',
    salesEndDate: '',
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
    selectVillage: ''
  })
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  // Separate states for 5 images: 1 main + 4 additional
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null, null, null])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(['', '', '', ''])
  const [isMainDragging, setIsMainDragging] = useState(false)
  const [isAdditionalDragging, setIsAdditionalDragging] = useState<boolean[]>([false, false, false, false])
  const [dimensionParts, setDimensionParts] = useState({
    length: '',
    width: '',
    height: '',
    unit: 'cm'
  })
  const [editDimensionParts, setEditDimensionParts] = useState({
    length: '',
    width: '',
    height: '',
    unit: 'cm'
  })
  const [weightParts, setWeightParts] = useState({
    value: '',
    unit: 'g'
  })
  const [editWeightParts, setEditWeightParts] = useState({
    value: '',
    unit: 'g'
  })
  const [authenticityChecked, setAuthenticityChecked] = useState(false)
  const [editAuthenticityChecked, setEditAuthenticityChecked] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')

  // Parse dimensions string into parts
  const parseDimensions = (dimensionsStr: string) => {
    if (!dimensionsStr) return { length: '', width: '', height: '', unit: 'cm' }
    
    // Try to parse formats like "20cm x 15cm x 10cm" or "20 x 15 x 10 cm"
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(cm|m|in|ft)\s*x\s*(\d+(?:\.\d+)?)\s*(cm|m|in|ft)\s*x\s*(\d+(?:\.\d+)?)\s*(cm|m|in|ft)/i,
      /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(cm|m|in|ft)/i
    ]
    
    for (const pattern of patterns) {
      const match = dimensionsStr.match(pattern)
      if (match) {
        return {
          length: match[1] || '',
          width: match[2] || '',
          height: match[3] || '',
          unit: (match[4] || match[6] || 'cm').toLowerCase()
        }
      }
    }
    
    return { length: '', width: '', height: '', unit: 'cm' }
  }

  // Combine dimension parts into string
  const combineDimensions = (parts: { length: string; width: string; height: string; unit: string }): string => {
    if (!parts.length && !parts.width && !parts.height) return ''
    const dims = [parts.length, parts.width, parts.height].filter(d => d.trim() !== '')
    if (dims.length === 0) return ''
    return dims.join(` x `) + ' ' + parts.unit
  }

  // Parse weight string into parts
  const parseWeight = (weightStr: string) => {
    if (!weightStr) return { value: '', unit: 'g' }
    
    // Try to parse formats like "500g", "1.5kg", "500 g", "1.5 kg"
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(g|kg)/i
    ]
    
    for (const pattern of patterns) {
      const match = weightStr.match(pattern)
      if (match) {
        return {
          value: match[1] || '',
          unit: (match[2] || 'g').toLowerCase()
        }
      }
    }
    
    // If no unit found, try to extract just the number
    const numMatch = weightStr.match(/(\d+(?:\.\d+)?)/)
    if (numMatch) {
      return {
        value: numMatch[1] || '',
        unit: 'g'
      }
    }
    
    return { value: '', unit: 'g' }
  }

  // Combine weight parts into string
  const combineWeight = (parts: { value: string; unit: string }): string => {
    if (!parts.value || parts.value.trim() === '') return ''
    return parts.value + parts.unit
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Update dimensions string when dimension parts change
  useEffect(() => {
    const dimsString = combineDimensions(dimensionParts)
    setFormData(prev => ({ ...prev, dimensions: dimsString }))
  }, [dimensionParts])

  // Parse dimensions when formData.dimensions changes (from edit)
  useEffect(() => {
    if (formData.dimensions && !dimensionParts.length && !dimensionParts.width && !dimensionParts.height) {
      const parsed = parseDimensions(formData.dimensions)
      setDimensionParts(parsed)
    }
  }, [formData.dimensions])

  // Update weight string when weight parts change
  useEffect(() => {
    const weightString = combineWeight(weightParts)
    setFormData(prev => ({ ...prev, weight: weightString }))
  }, [weightParts])

  // Parse weight when formData.weight changes (from edit)
  useEffect(() => {
    if (formData.weight && !weightParts.value) {
      const parsed = parseWeight(formData.weight)
      setWeightParts(parsed)
    }
  }, [formData.weight])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:4000/api/products')
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
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
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

  const handleEditClick = (product: any) => {
    setSelectedProduct(product)
    setIsEditMode(true)
    
    // Calculate price when loading edit data
    const earlyPriceStr = String(product.earlyPrice || '')
    const discountStr = String(product.discountPercentage || '')
    const calculatedPrice = calculatePrice(earlyPriceStr, discountStr) || String(product.price || 0)
    
    // Parse weight for edit
    const parsedWeight = parseWeight(product.weight || '')
    setEditWeightParts(parsedWeight)
    
    // Check if authenticity is the verified text
    const isAuthenticityVerified = product.authenticity === 'Verified with QR code and artisan signature'
    setEditAuthenticityChecked(isAuthenticityVerified)
    
    // Initialize images - handle both array and string formats
    let existingImages: string[] = []
    if (Array.isArray(product.images)) {
      existingImages = product.images.filter((img: string) => img && img.trim())
    } else if (product.images && typeof product.images === 'string') {
      // If it's a string, try to split it, but be careful with base64 images
      existingImages = product.images.split(',').map((img: string) => img.trim()).filter((img: string) => img)
    }
    
    // Set image previews to show existing images
    setImagePreviews(existingImages)
    setImageFiles([]) // Clear file array since these are existing images
    
    setEditData({
      title: product.title || '',
      subtitle: product.subtitle || '',
      category: product.category || '',
      branches: product.branches || '',
      price: parseFloat(calculatedPrice) || 0,
      earlyPrice: product.earlyPrice || '',
      discountPercentage: product.discountPercentage || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      color: product.color || '',
      craftTechnique: product.craftTechnique || '',
      origin: product.origin || '',
      authenticity: product.authenticity || '',
      careInstruction: Array.isArray(product.careInstruction) ? product.careInstruction.join('\n') : '',
      shipping: product.shipping || '',
      returnsDescription: product.returnsDescription || '',
      images: existingImages.join(','), // Store as comma-separated for saving
      artisanStory: product.artisanStory || '',
      selectVillage: product.selectVillage || ''
    })
    setShowModal(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    let updatedEditData = {
      ...editData,
      [name]: type === 'checkbox' ? checked : value
    }
    
    // Recalculate price if earlyPrice or discountPercentage changes
    if (name === 'earlyPrice' || name === 'discountPercentage') {
      const newEarlyPrice = name === 'earlyPrice' ? value : updatedEditData.earlyPrice
      const newDiscount = name === 'discountPercentage' ? value : updatedEditData.discountPercentage
      const calculatedPrice = calculatePrice(
        typeof newEarlyPrice === 'string' ? newEarlyPrice : String(newEarlyPrice || ''),
        typeof newDiscount === 'string' ? newDiscount : String(newDiscount || '')
      )
      updatedEditData.price = calculatedPrice ? parseFloat(calculatedPrice) : 0
    }
    
    setEditData(updatedEditData)
  }

  const handleEditImagesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length === 0) {
      alert('Please select valid image files')
      return
    }

    try {
      const compressedImages = await Promise.all(validFiles.map(file => compressImage(file)))
      // Combine existing previews with new ones
      const combinedPreviews = [...imagePreviews, ...compressedImages]
      const combinedFiles = [...imageFiles, ...validFiles]
      
      setImageFiles(combinedFiles)
      setImagePreviews(combinedPreviews)
      
      setEditData({
        ...editData,
        images: combinedPreviews.join(',')
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process images')
    }
  }

  const handleEditFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleEditImagesSelect(files)
    }
  }

  const handleEditDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleEditDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleEditDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleEditImagesSelect(files)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedProduct) return

    try {
      let imageUrls: string[] = []

      // Use uploaded images if available, otherwise use existing URLs
      if (imagePreviews.length > 0) {
        imageUrls = imagePreviews
      } else if (editData.images) {
        imageUrls = editData.images.split(',').map((img: string) => img.trim()).filter((img: string) => img)
      }

      // Calculate price if not already calculated
      const earlyPriceStr = typeof editData.earlyPrice === 'string' ? editData.earlyPrice : String(editData.earlyPrice || '')
      const discountStr = typeof editData.discountPercentage === 'string' ? editData.discountPercentage : String(editData.discountPercentage || '')
      const calculatedPrice = editData.price ? String(editData.price) : calculatePrice(earlyPriceStr, discountStr)
      
      const productData = {
        ...editData,
        price: calculatedPrice ? parseFloat(calculatedPrice) : (editData.earlyPrice ? parseFloat(editData.earlyPrice.toString()) : 0),
        earlyPrice: editData.earlyPrice ? parseFloat(editData.earlyPrice.toString()) : undefined,
        discountPercentage: editData.discountPercentage && String(editData.discountPercentage).trim() !== '' ? parseFloat(editData.discountPercentage.toString()) : undefined,
        images: imageUrls,
        careInstruction: editData.careInstruction ? editData.careInstruction.split('\n').filter((line: string) => line.trim()) : []
      }

      const response = await fetch(`http://localhost:4000/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
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
        setImageFiles([])
        setImagePreviews([])
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

  // Calculate price from earlyPrice and discountPercentage
  const calculatePrice = (earlyPrice: string, discountPercentage: string): string => {
    if (!earlyPrice) return ''
    const earlyPriceNum = parseFloat(earlyPrice)
    if (isNaN(earlyPriceNum)) return ''
    
    if (discountPercentage && discountPercentage.trim() !== '') {
      const discountNum = parseFloat(discountPercentage)
      if (!isNaN(discountNum) && discountNum > 0) {
        const calculatedPrice = earlyPriceNum * (1 - discountNum / 100)
        return calculatedPrice.toFixed(2)
      }
    }
    
    return earlyPriceNum.toFixed(2)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    let updatedFormData = { ...formData }
    
    if (type === 'checkbox') {
      updatedFormData = {
        ...formData,
        [name]: checked
      }
    } else {
      updatedFormData = {
        ...formData,
        [name]: value
      }
    }
    
    // Recalculate price if earlyPrice or discountPercentage changes
    if (name === 'earlyPrice' || name === 'discountPercentage') {
      const newEarlyPrice = name === 'earlyPrice' ? value : updatedFormData.earlyPrice
      const newDiscount = name === 'discountPercentage' ? value : updatedFormData.discountPercentage
      updatedFormData.price = calculatePrice(newEarlyPrice, newDiscount)
    }
    
    setFormData(updatedFormData)
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

  const handleImagesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length === 0) {
      alert('Please select valid image files')
      return
    }

    try {
      const compressedImages = await Promise.all(validFiles.map(file => compressImage(file)))
      setImageFiles(validFiles)
      setImagePreviews(compressedImages)
      
      setFormData({
        ...formData,
        images: compressedImages.join(',')
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process images')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImagesSelect(files)
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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImagesSelect(files)
    }
  }

  // Handler for main image upload
  const handleMainImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    try {
      const compressedImage = await compressImage(file)
      setMainImageFile(file)
      setMainImagePreview(compressedImage)
      updateFormImagesArray()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process image')
    }
  }

  // Handler for additional image upload (index 0-3)
  const handleAdditionalImageSelect = async (file: File, index: number) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    try {
      const compressedImage = await compressImage(file)
      const newFiles = [...additionalImageFiles]
      const newPreviews = [...additionalImagePreviews]
      newFiles[index] = file
      newPreviews[index] = compressedImage
      setAdditionalImageFiles(newFiles)
      setAdditionalImagePreviews(newPreviews)
      updateFormImagesArray()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process image')
    }
  }

  // Update the combined images array for form
  const updateFormImagesArray = () => {
    const allImages = [mainImagePreview, ...additionalImagePreviews].filter(img => img && img.trim())
    setFormData({
      ...formData,
      images: allImages.join(',')
    })
  }

  // Remove main image
  const handleRemoveMainImage = () => {
    setMainImageFile(null)
    setMainImagePreview('')
    updateFormImagesArray()
  }

  // Remove additional image
  const handleRemoveAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles]
    const newPreviews = [...additionalImagePreviews]
    newFiles[index] = null
    newPreviews[index] = ''
    setAdditionalImageFiles(newFiles)
    setAdditionalImagePreviews(newPreviews)
    updateFormImagesArray()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || formData.title.trim() === '') {
      alert('Please enter a product title')
      return
    }
    
    if (!formData.earlyPrice || formData.earlyPrice.trim() === '') {
      alert('Please enter an early price')
      return
    }
    
    try {
      // Prepare data for API
      // Combine main image and additional images
      let imageArray: string[] = []
      const allImages = [mainImagePreview, ...additionalImagePreviews].filter(img => img && img.trim())
      if (allImages.length > 0) {
        imageArray = allImages
      } else if (imagePreviews.length > 0) {
        // Fallback to old method
        imageArray = imagePreviews
      } else if (formData.images) {
        imageArray = formData.images.split(',').map(img => img.trim()).filter(img => img)
      }

      // Calculate price if not already calculated
      const calculatedPrice = formData.price || calculatePrice(formData.earlyPrice, formData.discountPercentage)

      const productData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle ? formData.subtitle.trim() : undefined,
        category: formData.category ? formData.category.trim() : undefined,
        branches: formData.branches ? formData.branches.trim() : undefined,
        price: calculatedPrice ? parseFloat(calculatedPrice) : (formData.earlyPrice ? parseFloat(formData.earlyPrice) : 0),
        earlyPrice: formData.earlyPrice ? parseFloat(formData.earlyPrice) : undefined,
        discountPercentage: formData.discountPercentage && formData.discountPercentage.trim() !== '' ? parseFloat(formData.discountPercentage) : undefined,
        salesEndDate: formData.salesEndDate ? new Date(formData.salesEndDate).toISOString() : undefined,
        material: formData.material ? formData.material.trim() : undefined,
        dimensions: formData.dimensions ? formData.dimensions.trim() : undefined,
        weight: formData.weight ? formData.weight.trim() : undefined,
        color: formData.color ? formData.color.trim() : undefined,
        craftTechnique: formData.craftTechnique ? formData.craftTechnique.trim() : undefined,
        origin: formData.origin ? formData.origin.trim() : undefined,
        authenticity: formData.authenticity ? formData.authenticity.trim() : undefined,
        shipping: formData.shipping ? formData.shipping.trim() : undefined,
        returnsDescription: formData.returnsDescription ? formData.returnsDescription.trim() : undefined,
        images: imageArray,
        careInstruction: formData.careInstruction ? formData.careInstruction.split('\n').filter(line => line.trim()) : [],
        artisanStory: formData.artisanStory ? formData.artisanStory.trim() : undefined,
        selectVillage: formData.selectVillage ? formData.selectVillage.trim() : undefined
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
          const errorMessage = errorData.error || errorData.message || 'Server error'
          console.error('Server error:', errorData)
          alert(`Failed to save product: ${errorMessage}`)
        } catch {
          console.error('Error response:', errorText)
          alert(`Failed to save product: ${response.status} ${response.statusText}`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        alert('Product saved successfully!')
        
        // Generate QR code URL for the product
        const productId = data.data?.id || data.data?._id || ''
        const qrCodeUrl = `http://localhost:3000/Market/${productId}`
        setQrCodeData(qrCodeUrl)
        setShowQRCode(true)
        
        setFormData({
          title: '', subtitle: '', category: '', branches: '', price: '', earlyPrice: '', discountPercentage: '',
          salesEndDate: '', material: '', dimensions: '', weight: '',
          color: '', craftTechnique: '', origin: '', authenticity: '', careInstruction: '',
          shipping: '', returnsDescription: '', images: '', artisanStory: '', selectVillage: ''
        })
        setDimensionParts({ length: '', width: '', height: '', unit: 'cm' })
        setWeightParts({ value: '', unit: 'g' })
        setAuthenticityChecked(false)
        // Clear all image states
        setImageFiles([])
        setImagePreviews([])
        setMainImageFile(null)
        setMainImagePreview('')
        setAdditionalImageFiles([null, null, null, null])
        setAdditionalImagePreviews(['', '', '', ''])
        // Refresh the product list
        fetchProducts()
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
              <label className='block text-blackbrown font-medium mb-2'>Price (Calculated)</label>
              <input
                type='text'
                name='price'
                value={formData.price ? `$${formData.price}` : ''}
                readOnly
                className='w-full px-4 py-2 border border-lightbrown rounded bg-lightbrown/30 text-blackbrown cursor-not-allowed'
                placeholder='Auto-calculated from Early Price and Discount'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Early Price *</label>
              <input
                type='number'
                name='earlyPrice'
                value={formData.earlyPrice}
                onChange={handleChange}
                step='0.01'
                min='0'
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter early price'
              />
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Discount % (Optional)</label>
              <input
                type='number'
                name='discountPercentage'
                value={formData.discountPercentage}
                onChange={handleChange}
                step='0.01'
                min='0'
                max='100'
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Enter discount % (optional)'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Category</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              >
                <option value=''>Select Category</option>
                <option value='Wooden Crafts'>Wooden Crafts</option>
                <option value='Textiles & Fabric'>Textiles & Fabric</option>
                <option value='Ceramics & Pottery'>Ceramics & Pottery</option>
                <option value='Jewelry & Accessories'>Jewelry & Accessories</option>
                <option value='Home & Living'>Home & Living</option>
              </select>
            </div>

            <div>
              <label className='block text-blackbrown font-medium mb-2'>Branches</label>
              <select
                name='branches'
                value={formData.branches}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
              >
                <option value=''>Select Branch</option>
                <option value='One Galle face'>One Galle face</option>
                <option value='Colombo City Centre Mall'>Colombo City Centre Mall</option>
                <option value='Canowin Arcade B'>Canowin Arcade B</option>
                <option value='Port city Downtown'>Port city Downtown</option>
                <option value='Shangri-La Hambantota'>Shangri-La Hambantota</option>
              </select>
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
              <div className='grid grid-cols-4 gap-2'>
                <div>
                  <input
                    type='number'
                    step='0.1'
                    min='0'
                    value={dimensionParts.length}
                    onChange={(e) => setDimensionParts({ ...dimensionParts, length: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Length'
                  />
                </div>
                <div>
                  <input
                    type='number'
                    step='0.1'
                    min='0'
                    value={dimensionParts.width}
                    onChange={(e) => setDimensionParts({ ...dimensionParts, width: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Width'
                  />
                </div>
                <div>
                  <input
                    type='number'
                    step='0.1'
                    min='0'
                    value={dimensionParts.height}
                    onChange={(e) => setDimensionParts({ ...dimensionParts, height: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Height'
                  />
                </div>
                <div>
                  <select
                    value={dimensionParts.unit}
                    onChange={(e) => setDimensionParts({ ...dimensionParts, unit: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  >
                    <option value='cm'>cm</option>
                    <option value='m'>m</option>
                    <option value='in'>in</option>
                    <option value='ft'>ft</option>
                  </select>
                </div>
              </div>
              {formData.dimensions && (
                <p className='text-sm text-blackbrown/70 mt-1'>Preview: {formData.dimensions}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Weight</label>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <input
                    type='number'
                    step='0.1'
                    min='0'
                    value={weightParts.value}
                    onChange={(e) => setWeightParts({ ...weightParts, value: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='Enter weight'
                  />
                </div>
                <div>
                  <select
                    value={weightParts.unit}
                    onChange={(e) => setWeightParts({ ...weightParts, unit: e.target.value })}
                    className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  >
                    <option value='g'>g</option>
                    <option value='kg'>kg</option>
                  </select>
                </div>
              </div>
              {formData.weight && (
                <p className='text-sm text-blackbrown/70 mt-1'>Preview: {formData.weight}</p>
              )}
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
            <div className='flex items-center gap-4 mb-2'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={authenticityChecked}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setAuthenticityChecked(checked)
                    setFormData({
                      ...formData,
                      authenticity: checked ? 'Verified with QR code and artisan signature' : ''
                    })
                  }}
                  className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown cursor-pointer custom-checkbox'
                />
                <span className='text-blackbrown font-medium'>Verified with QR code and artisan signature</span>
              </label>
            </div>
            {!authenticityChecked && (
              <input
                type='text'
                name='authenticity'
                value={formData.authenticity}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                placeholder='Or enter custom authenticity text'
              />
            )}
            {authenticityChecked && (
              <p className='text-sm text-blackbrown/70 bg-lightbrown/20 p-2 rounded'>
                Verified with QR code and artisan signature
              </p>
            )}
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
            <label className='block text-blackbrown font-medium mb-3'>Images (1 Main + 4 Additional)</label>
            <div className='space-y-4'>
              {/* Main Image Upload Area */}
              <div>
                <label className='block text-blackbrown font-medium mb-2 text-sm'>Main Image</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsMainDragging(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsMainDragging(false) }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsMainDragging(false)
                    const files = e.dataTransfer.files
                    if (files.length > 0) {
                      handleMainImageSelect(files[0])
                    }
                  }}
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isMainDragging
                      ? 'border-secondarybrown bg-lightbrown/20'
                      : 'border-secondarybrown bg-primary hover:border-secondarybrown/50'
                  }`}
                >
                  {mainImagePreview ? (
                    <div className='relative inline-block'>
                      <img
                        src={mainImagePreview}
                        alt='Main preview'
                        className='w-32 h-32 object-cover rounded border-2 border-secondarybrown'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <button
                        type='button'
                        onClick={handleRemoveMainImage}
                        className='absolute top-1 right-1 bg-secondarybrown text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-secondarybrown/80'
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className='mx-auto h-8 w-8 text-lightbrown' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                        <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                      <p className='mt-2 text-xs text-blackbrown'>Drag & drop or click to upload</p>
                      <label className='mt-2 bg-secondarybrown text-primary px-3 py-1 rounded hover:bg-secondarybrown/90 transition-colors text-xs cursor-pointer inline-block'>
                        Select Main Image
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleMainImageSelect(e.target.files[0])
                            }
                          }}
                          className='hidden'
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images Upload Areas */}
              <div>
                <label className='block text-blackbrown font-medium mb-2 text-sm'>Additional Images (4)</label>
                <div className='grid grid-cols-2 gap-4'>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <label className='block text-blackbrown text-xs mb-1'>Image {index + 1}</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          const newDragging = [...isAdditionalDragging]
                          newDragging[index] = true
                          setIsAdditionalDragging(newDragging)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          const newDragging = [...isAdditionalDragging]
                          newDragging[index] = false
                          setIsAdditionalDragging(newDragging)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const newDragging = [...isAdditionalDragging]
                          newDragging[index] = false
                          setIsAdditionalDragging(newDragging)
                          const files = e.dataTransfer.files
                          if (files.length > 0) {
                            handleAdditionalImageSelect(files[0], index)
                          }
                        }}
                        className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                          isAdditionalDragging[index]
                            ? 'border-secondarybrown bg-lightbrown/20'
                            : 'border-lightbrown bg-primary hover:border-secondarybrown/50'
                        }`}
                      >
                        {additionalImagePreviews[index] ? (
                          <div className='relative inline-block'>
                            <img
                              src={additionalImagePreviews[index]}
                              alt={`Additional ${index + 1}`}
                              className='w-24 h-24 object-cover rounded border border-lightbrown'
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                            <button
                              type='button'
                              onClick={() => handleRemoveAdditionalImage(index)}
                              className='absolute top-0 right-0 bg-secondarybrown text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-secondarybrown/80 -mt-1 -mr-1'
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg className='mx-auto h-6 w-6 text-lightbrown' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                              <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                            <p className='mt-1 text-xs text-blackbrown/70'>Upload</p>
                            <label className='mt-1 bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors text-xs cursor-pointer inline-block'>
                              Select
                              <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleAdditionalImageSelect(e.target.files[0], index)
                                  }
                                }}
                                className='hidden'
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              className='bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
            >
              Save Product
            </button>
            <button
              type='button'
              onClick={() => {
                setFormData({
                  title: '', subtitle: '', category: '', branches: '', price: '', earlyPrice: '', discountPercentage: '',
                  salesEndDate: '', material: '', dimensions: '', weight: '',
                  color: '', craftTechnique: '', origin: '', authenticity: '', careInstruction: '',
                  shipping: '', returnsDescription: '', images: '', artisanStory: '', selectVillage: ''
                })
                setDimensionParts({ length: '', width: '', height: '', unit: 'cm' })
                setWeightParts({ value: '', unit: 'g' })
                setAuthenticityChecked(false)
              }}
              className='bg-lightbrown text-blackbrown px-6 py-2 rounded hover:bg-lightbrown/80 transition-colors font-semibold'
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Section - Show after product is saved */}
      {showQRCode && qrCodeData && (
        <div className='mt-6 bg-primary border border-lightbrown rounded p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-blackbrown text-xl font-semibold'>Product QR Code</h2>
            <button
              onClick={() => {
                setShowQRCode(false)
                setQrCodeData('')
              }}
              className='text-blackbrown hover:text-secondarybrown text-xl font-bold'
            >
              ×
            </button>
          </div>
          <div className='flex justify-center'>
            <div className='w-full max-w-md'>
              <QRcode initialValue={qrCodeData} />
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className='mt-8 bg-primary border border-lightbrown rounded p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-blackbrown text-2xl font-semibold'>All Products</h2>
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
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Title</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Subtitle</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Price</th>
                  <th className='border border-lightbrown px-4 py-2 text-left text-blackbrown font-semibold'>Images</th>
                  <th className='border border-lightbrown px-2 py-2 text-left text-blackbrown font-semibold w-24'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className='hover:bg-lightbrown/20'>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{product.title}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>{product.subtitle}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>${product.price}</td>
                    <td className='border border-lightbrown px-4 py-2 text-blackbrown'>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className='w-16 h-16 object-cover rounded border border-lightbrown'
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className='text-blackbrown/50 text-sm'>No image</span>
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
                          onClick={() => {
                            // Generate QR code URL for this product
                            const productId = product.id || product._id || ''
                            const qrCodeUrl = `http://localhost:3000/Market/${productId}`
                            setQrCodeData(qrCodeUrl)
                            setShowQRCode(true)
                          }}
                          className='bg-secondarybrown text-primary px-2 py-1 rounded hover:bg-secondarybrown/90 transition-colors flex items-center justify-center'
                          title='Generate QR Code'
                        >
                          <HiQrcode className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          <div className='bg-primary border border-lightbrown rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-blackbrown text-2xl font-semibold'>{isEditMode ? 'Edit Product' : 'Product Details'}</h2>
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
                  <label className='block text-blackbrown font-semibold mb-1'>Title</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='title'
                      value={editData.title}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.title || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Subtitle</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='subtitle'
                      value={editData.subtitle}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.subtitle || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Category</label>
                {isEditMode ? (
                  <select
                    name='category'
                    value={editData.category || ''}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  >
                    <option value=''>Select Category</option>
                    <option value='Wooden Crafts'>Wooden Crafts</option>
                    <option value='Textiles & Fabric'>Textiles & Fabric</option>
                    <option value='Ceramics & Pottery'>Ceramics & Pottery</option>
                    <option value='Jewelry & Accessories'>Jewelry & Accessories</option>
                    <option value='Home & Living'>Home & Living</option>
                  </select>
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.category || '-'}</p>
                )}
              </div>

              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Branches</label>
                {isEditMode ? (
                  <select
                    name='branches'
                    value={editData.branches || ''}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  >
                    <option value=''>Select Branch</option>
                    <option value='One Galle face'>One Galle face</option>
                    <option value='Colombo City Centre Mall'>Colombo City Centre Mall</option>
                    <option value='Canowin Arcade B'>Canowin Arcade B</option>
                    <option value='Port city Downtown'>Port city Downtown</option>
                    <option value='Shangri-La Hambantota'>Shangri-La Hambantota</option>
                  </select>
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.branches || '-'}</p>
                )}
              </div>
              
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Price (Calculated)</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='price'
                      value={editData.price ? `$${typeof editData.price === 'number' ? editData.price.toFixed(2) : editData.price}` : ''}
                      readOnly
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-lightbrown/30 text-blackbrown cursor-not-allowed'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>${selectedProduct.price || 0}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Early Price *</label>
                  {isEditMode ? (
                    <input
                      type='number'
                      name='earlyPrice'
                      value={editData.earlyPrice}
                      onChange={handleEditChange}
                      step='0.01'
                      min='0'
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>${selectedProduct.earlyPrice || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Discount % (Optional)</label>
                  {isEditMode ? (
                    <input
                      type='number'
                      name='discountPercentage'
                      value={editData.discountPercentage}
                      onChange={handleEditChange}
                      step='0.01'
                      min='0'
                      max='100'
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.discountPercentage ? `${selectedProduct.discountPercentage}%` : '-'}</p>
                  )}
                </div>
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Material</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='material'
                      value={editData.material}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.material || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Dimensions</label>
                  {isEditMode ? (
                    <div>
                      <div className='grid grid-cols-4 gap-2 mb-2'>
                        <div>
                          <input
                            type='number'
                            step='0.1'
                            min='0'
                            value={editDimensionParts.length}
                            onChange={(e) => {
                              const updated = { ...editDimensionParts, length: e.target.value }
                              setEditDimensionParts(updated)
                              const dimsString = combineDimensions(updated)
                              setEditData({ ...editData, dimensions: dimsString })
                            }}
                            className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                            placeholder='Length'
                          />
                        </div>
                        <div>
                          <input
                            type='number'
                            step='0.1'
                            min='0'
                            value={editDimensionParts.width}
                            onChange={(e) => {
                              const updated = { ...editDimensionParts, width: e.target.value }
                              setEditDimensionParts(updated)
                              const dimsString = combineDimensions(updated)
                              setEditData({ ...editData, dimensions: dimsString })
                            }}
                            className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                            placeholder='Width'
                          />
                        </div>
                        <div>
                          <input
                            type='number'
                            step='0.1'
                            min='0'
                            value={editDimensionParts.height}
                            onChange={(e) => {
                              const updated = { ...editDimensionParts, height: e.target.value }
                              setEditDimensionParts(updated)
                              const dimsString = combineDimensions(updated)
                              setEditData({ ...editData, dimensions: dimsString })
                            }}
                            className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                            placeholder='Height'
                          />
                        </div>
                        <div>
                          <select
                            value={editDimensionParts.unit}
                            onChange={(e) => {
                              const updated = { ...editDimensionParts, unit: e.target.value }
                              setEditDimensionParts(updated)
                              const dimsString = combineDimensions(updated)
                              setEditData({ ...editData, dimensions: dimsString })
                            }}
                            className='w-full px-3 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                          >
                            <option value='cm'>cm</option>
                            <option value='m'>m</option>
                            <option value='in'>in</option>
                            <option value='ft'>ft</option>
                          </select>
                        </div>
                      </div>
                      {editData.dimensions && (
                        <p className='text-sm text-blackbrown/70'>Preview: {editData.dimensions}</p>
                      )}
                    </div>
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.dimensions || '-'}</p>
                  )}
                </div>
              </div>
              
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Weight</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='weight'
                      value={editData.weight}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.weight || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Color</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='color'
                      value={editData.color}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.color || '-'}</p>
                  )}
                </div>
                <div>
                  <label className='block text-blackbrown font-semibold mb-1'>Craft Technique</label>
                  {isEditMode ? (
                    <input
                      type='text'
                      name='craftTechnique'
                      value={editData.craftTechnique}
                      onChange={handleEditChange}
                      className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    />
                  ) : (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.craftTechnique || '-'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Origin</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='origin'
                    value={editData.origin}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.origin || '-'}</p>
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Authenticity</label>
                {isEditMode ? (
                  <div>
                    <div className='flex items-center gap-4 mb-2'>
                      <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={editAuthenticityChecked}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setEditAuthenticityChecked(checked)
                            setEditData({
                              ...editData,
                              authenticity: checked ? 'Verified with QR code and artisan signature' : ''
                            })
                          }}
                          className='w-4 h-4 accent-secondarybrown bg-lightbrown border-lightbrown focus:ring-secondarybrown cursor-pointer custom-checkbox'
                        />
                        <span className='text-blackbrown font-semibold'>Verified with QR code and artisan signature</span>
                      </label>
                    </div>
                    {!editAuthenticityChecked && (
                      <input
                        type='text'
                        name='authenticity'
                        value={editData.authenticity}
                        onChange={handleEditChange}
                        className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                        placeholder='Or enter custom authenticity text'
                      />
                    )}
                    {editAuthenticityChecked && (
                      <p className='text-sm text-blackbrown/70 bg-lightbrown/20 p-2 rounded'>
                        Verified with QR code and artisan signature
                      </p>
                    )}
                  </div>
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.authenticity || '-'}</p>
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Care Instructions (one per line)</label>
                {isEditMode ? (
                  <textarea
                    name='careInstruction'
                    value={editData.careInstruction}
                    onChange={handleEditChange}
                    rows={3}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                    placeholder='One instruction per line'
                  />
                ) : (
                  selectedProduct.careInstruction && selectedProduct.careInstruction.length > 0 && (
                    <ul className='list-disc list-inside text-blackbrown bg-lightbrown/20 p-2 rounded space-y-1'>
                      {(Array.isArray(selectedProduct.careInstruction) ? selectedProduct.careInstruction : []).map((instruction: string, index: number) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Images</label>
                {isEditMode ? (
                  <div
                    onDragOver={handleEditDragOver}
                    onDragLeave={handleEditDragLeave}
                    onDrop={handleEditDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging
                        ? 'border-secondarybrown bg-lightbrown/20'
                        : 'border-lightbrown bg-primary hover:border-secondarybrown/50'
                    }`}
                  >
                    {imagePreviews.length > 0 ? (
                      <div className='space-y-4'>
                        <div className='grid grid-cols-3 gap-2'>
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className='relative'>
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className='w-full h-32 object-cover rounded border border-lightbrown'
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                              <button
                                type='button'
                                onClick={() => {
                                  const newPreviews = imagePreviews.filter((_, i) => i !== index)
                                  const newFiles = imageFiles.filter((_, i) => i !== index)
                                  setImagePreviews(newPreviews)
                                  setImageFiles(newFiles)
                                  setEditData({
                                    ...editData,
                                    images: newPreviews.join(',')
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
                              onChange={handleEditFileInputChange}
                              className='hidden'
                            />
                          </label>
                          <button
                            type='button'
                            onClick={() => {
                              setImageFiles([])
                              setImagePreviews([])
                              setEditData({ ...editData, images: '' })
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
                            onChange={handleEditFileInputChange}
                            className='hidden'
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className='grid grid-cols-3 gap-2'>
                      {selectedProduct.images.map((img: string, index: number) => (
                        <img key={index} src={img} alt={`${selectedProduct.title} ${index + 1}`} className='w-full h-32 object-cover rounded border border-lightbrown' />
                      ))}
                    </div>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Artisan Story</label>
                {isEditMode ? (
                  <textarea
                    name='artisanStory'
                    value={editData.artisanStory}
                    onChange={handleEditChange}
                    rows={4}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  selectedProduct.artisanStory && (
                    <p className='text-blackbrown bg-lightbrown/20 p-2 rounded whitespace-pre-wrap'>{selectedProduct.artisanStory}</p>
                  )
                )}
              </div>
              
              <div>
                <label className='block text-blackbrown font-semibold mb-1'>Village</label>
                {isEditMode ? (
                  <input
                    type='text'
                    name='selectVillage'
                    value={editData.selectVillage}
                    onChange={handleEditChange}
                    className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                  />
                ) : (
                  <p className='text-blackbrown bg-lightbrown/20 p-2 rounded'>{selectedProduct.selectVillage || '-'}</p>
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

export default NormalProduct


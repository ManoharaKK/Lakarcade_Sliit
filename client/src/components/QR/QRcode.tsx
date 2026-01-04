'use client'
import React, { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRcodeProps {
  initialValue?: string
}

function QRcode({ initialValue = '' }: QRcodeProps) {
  const [qrData, setQrData] = useState('')
  const [displayQR, setDisplayQR] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const qrCodeRef = useRef<SVGSVGElement>(null)

  // Auto-generate QR code if initialValue is provided
  useEffect(() => {
    if (initialValue && initialValue.trim()) {
      setQrData(initialValue.trim())
      setDisplayQR(true)
      setInputValue(initialValue.trim())
    }
  }, [initialValue])

  const handleGenerate = () => {
    if (inputValue.trim()) {
      setQrData(inputValue.trim())
      setDisplayQR(true)
    } else {
      alert('Please enter some text or URL to generate QR code')
    }
  }

  const handleClear = () => {
    setInputValue('')
    setQrData('')
    setDisplayQR(false)
  }

  return (
    <div className='flex flex-col items-center justify-center p-6 bg-primary rounded-lg border border-lightbrown'>
      {!initialValue && <h2 className='text-2xl font-bold text-blackbrown mb-6'>QR Code Generator</h2>}
      
      <div className='w-full max-w-md space-y-4'>
        {!initialValue && (
          <>
            <div>
              <label className='block text-blackbrown font-medium mb-2'>Enter text or URL</label>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Enter text or URL here...'
                className='w-full px-4 py-2 border border-lightbrown rounded bg-primary text-blackbrown focus:outline-none focus:ring-2 focus:ring-secondarybrown'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleGenerate()
                  }
                }}
              />
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleGenerate}
                className='flex-1 bg-secondarybrown text-primary px-6 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold'
              >
                Generate QR Code
              </button>
              {displayQR && (
                <button
                  onClick={handleClear}
                  className='flex-1 bg-lightbrown text-blackbrown px-6 py-2 rounded hover:bg-lightbrown/80 transition-colors font-semibold'
                >
                  Clear
                </button>
              )}
            </div>
          </>
        )}

        {displayQR && qrData && (
          <div className='flex flex-col items-center mt-6 p-4 bg-white rounded-lg border border-lightbrown'>
            <div className='p-4 bg-white rounded'>
              <QRCodeSVG
                ref={qrCodeRef}
                value={qrData}
                size={256}
                level='H'
                includeMargin={true}
              />
            </div>
            <p className='mt-4 text-sm text-blackbrown/70 text-center break-all max-w-xs'>
              {qrData}
            </p>
            <button
              onClick={() => {
                if (!qrCodeRef.current) {
                  alert('QR code not found')
                  return
                }
                
                try {
                  const svg = qrCodeRef.current
                  const svgData = new XMLSerializer().serializeToString(svg)
                  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
                  const url = URL.createObjectURL(svgBlob)
                  
                  const img = new Image()
                  img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                      ctx.drawImage(img, 0, 0)
                      canvas.toBlob((blob) => {
                        if (blob) {
                          const downloadUrl = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = downloadUrl
                          link.download = 'qrcode.png'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          URL.revokeObjectURL(downloadUrl)
                          URL.revokeObjectURL(url)
                        }
                      }, 'image/png')
                    }
                  }
                  img.onerror = () => {
                    alert('Failed to load QR code image')
                    URL.revokeObjectURL(url)
                  }
                  img.src = url
                } catch (error) {
                  console.error('Error downloading QR code:', error)
                  alert('Failed to download QR code')
                }
              }}
              className='mt-4 bg-secondarybrown text-primary px-4 py-2 rounded hover:bg-secondarybrown/90 transition-colors font-semibold text-sm'
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRcode
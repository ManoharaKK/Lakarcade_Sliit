'use client'
import React, { useState } from 'react'
import Navbar from '../Navbar/navbar'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function signin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { 
        email, 
        password 
      })
      
      // Store user data in localStorage
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
      
      // Redirect to home page
      router.push('/')
    } catch (error: any) {
      // Silently handle errors - don't log to console
      if (error.response?.status === 400 || error.response?.status === 401) {
        // Handle validation errors - show to user only
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const fieldErrors: any = {}
          error.response.data.errors.forEach((err: any) => {
            fieldErrors[err.field] = err.message
          })
          setErrors(fieldErrors)
        } else if (error.response?.data?.message) {
          setErrors({ general: error.response.data.message })
        } else {
          setErrors({ general: 'Invalid email or password' })
        }
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else {
        setErrors({ general: 'Failed to login. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='relative w-full min-h-screen'>
        <img 
          src={'/images/Signup/Signup.jpg'} 
          alt='signin' 
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='containerpadding container mx-auto pt-20 pb-20 flex items-center justify-center min-h-screen'>
          <div className='grid grid-cols-2 gap-4 bg-white/10 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.4px] border border-white/50 p-6 max-w-6xl w-full'>
            <div className='flex flex-col justify-center items-center text-white'>
              <h1 className='text-4xl md:text-5xl font-bold mb-4'>Welcome Back</h1>
              <p className='text-lg md:text-xl opacity-90 text-center mb-8'>
                Sign in to continue your journey with authentic Sri Lankan handicrafts
              </p>
              <div className='space-y-4 w-full max-w-sm'>
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>✓</span>
                  </div>
                  <span className='text-white/90'>Access your account</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>✓</span>
                  </div>
                  <span className='text-white/90'>Browse exclusive items</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>✓</span>
                  </div>
                  <span className='text-white/90'>Manage your collection</span>
                </div>
              </div>
            </div>
            <div className='bg-white p-6 rounded-2xl shadow-md w-full h-full'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Sign In</h2>
                <p className='text-gray-600'>Welcome back! Please sign in to your account</p>
              </div>
              
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              {/* Google Sign In Button */}
              <div className="mb-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
              
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
              
              <form 
                onSubmit={handleSubmit}
                className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 text-sm rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              <div className="mt-4 text-right">
                <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </a>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-600">
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default signin


'use client'
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/navbar'
import Image from 'next/image'
import axios from 'axios'



function page() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const validateForm = () => {
        const newErrors: any = {}

        if (!firstName.trim()) newErrors.firstName = 'First name is required'
        if (!lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!username.trim()) newErrors.username = 'Username is required'
        if (!email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
        if (!password) newErrors.password = 'Password is required'
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
        else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const response = await axios.post('http://localhost:4000/api/users', {
                firstName,
                lastName,
                username,
                email,
                password,
                confirmPassword
            })
            setSuccess(true)
            // Reset form
            setFirstName('')
            setLastName('')
            setUsername('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            // Silently handle errors - don't log to console
            if (error.response?.status === 400) {
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
                    setErrors({ general: 'Invalid data. Please check your inputs.' })
                }
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message })
            } else {
                setErrors({ general: 'Failed to create user. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }
  return (
        <div className='min-h-screen'>
        <Navbar />
            <div className='relative w-full h-[100vh]'>
                <Image
                    src={'/images/Signup/Signup.jpg'}
                    alt='verify'
                    fill
                    className='object-cover'
                    priority
                />
                 <div className='containerpadding container mx-auto absolute inset-0  mt-[200px]'>
                     <div className='grid grid-cols-2 gap-4 bg-white/10 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.4px] border border-white/50 p-6'>
                         <div className='flex flex-col justify-center items-center text-white'>
                             <h1 className='text-4xl md:text-5xl font-bold mb-4'>Join Lakarcade</h1>
                             <p className='text-lg md:text-xl opacity-90 text-center mb-8'>
                                 Create your account and start your journey with authentic Sri Lankan handicrafts
                             </p>
                             <div className='space-y-4 w-full max-w-sm'>
                                 <div className='flex items-center space-x-4'>
                                     <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                                         <span className='text-white font-bold'>1</span>
                                     </div>
                                     <span className='text-white/90'>Create your account</span>
                                 </div>
                                 <div className='flex items-center space-x-4'>
                                     <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                                         <span className='text-white font-bold'>2</span>
                                     </div>
                                     <span className='text-white/90'>Verify your email</span>
                                 </div>
                                 <div className='flex items-center space-x-4'>
                                     <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                                         <span className='text-white font-bold'>3</span>
                                     </div>
                                     <span className='text-white/90'>Start exploring</span>
                                 </div>
                             </div>
                         </div>
                         <div className='bg-white p-6 rounded-2xl shadow-md w-full h-full'>
                             <div className='mb-6'>
                                 <h2 className='text-2xl font-bold text-gray-800 mb-2'>Sign Up</h2>
                                 <p className='text-gray-600'>Create your account to get started</p>
                             </div>
                             
                             {success && (
                                 <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                     Account created successfully! Please check your email to verify your account.
                                 </div>
                             )}
                             
                             {errors.general && (
                                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                     {errors.general}
                                 </div>
                             )}
                             
                             {/* Google Sign Up Button */}
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>

                                 <button
                                     type="submit"
                                     disabled={loading}
                                     className="w-full bg-blue-600 text-white py-2 text-sm rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     {loading ? 'Creating Account...' : 'Signup'}
                                 </button>
                            </form>
                            
                            <div className="mt-4 text-center text-xs text-gray-600">
                                <p>
                                    By creating an account, you agree to our{' '}
                                    <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                            
                            <div className="mt-3 text-center text-xs text-gray-600">
                                <p>
                                    Already have an account?{' '}
                                    <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Sign in
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

export default page
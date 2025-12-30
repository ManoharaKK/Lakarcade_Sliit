'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/navbar'
import { useWeb3 } from '@/providers/web3'
import { useAccount } from '@/hooks/web3'
import { Web3Provider } from '@/providers'
import Image from 'next/image'

function ProfileContent() {
  const { account } = useAccount()
  const { provider, ethereum, contract } = useWeb3()
  const [networkInfo, setNetworkInfo] = useState<{ name: string; chainId: string } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      if (provider) {
        try {
          const network = await provider.getNetwork()
          const chainId = network.chainId.toString()
          
          // Common network names
          const networkNames: { [key: string]: string } = {
            '1': 'Ethereum Mainnet',
            '3': 'Ropsten',
            '4': 'Rinkeby',
            '5': 'Goerli',
            '11155111': 'Sepolia',
            '5777': 'Ganache Local',
            '1337': 'Localhost'
          }
          
          setNetworkInfo({
            name: networkNames[chainId] || `Network ${chainId}`,
            chainId: chainId
          })
        } catch (error) {
          console.error('Error fetching network info:', error)
        }
      }
    }

    const fetchBalance = async () => {
      if (provider && account.data) {
        try {
          const balance = await provider.getBalance(account.data)
          const balanceInEth = (Number(balance) / 1e18).toFixed(4)
          setBalance(balanceInEth)
        } catch (error) {
          console.error('Error fetching balance:', error)
        }
      }
    }

    const fetchContractAddress = async () => {
      if (contract) {
        try {
          const address = await contract.getAddress()
          setContractAddress(address)
        } catch (error) {
          console.error('Error fetching contract address:', error)
        }
      }
    }

    fetchNetworkInfo()
    fetchBalance()
    fetchContractAddress()
  }, [provider, account.data, contract])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className='min-h-screen bg-blackbrown'>
      <Navbar />
      
      <div className='containerpadding container mx-auto pt-32 pb-20 px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white mb-2'>Profile</h1>
            <p className='text-primarybrown text-sm'>Manage your account and wallet settings</p>
          </div>

          {/* Account Card */}
          <div className='bg-[#F6E7CA] rounded-lg shadow-lg p-6 mb-6'>
            <h2 className='text-2xl font-semibold text-[#290E0A] mb-4'>Wallet Information</h2>
            
            {account.isLoading ? (
              <div className='text-center py-8'>
                <p className='text-[#290E0A]'>Loading account information...</p>
              </div>
            ) : account.data ? (
              <div className='space-y-4'>
                {/* Account Address */}
                <div className='bg-white rounded-lg p-4'>
                  <label className='text-xs font-medium text-gray-600 mb-2 block'>Account Address</label>
                  <div className='flex items-center justify-between'>
                    <code className='text-sm text-[#290E0A] font-mono break-all'>
                      {account.data}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.data!)}
                      className='ml-4 px-3 py-1 bg-[#693422] text-white text-xs rounded hover:bg-[#693422]/90 transition-colors'
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Shortened Address */}
                <div className='bg-white rounded-lg p-4'>
                  <label className='text-xs font-medium text-gray-600 mb-2 block'>Short Address</label>
                  <code className='text-sm text-[#290E0A] font-mono'>
                    {`${account.data.slice(0, 6)}...${account.data.slice(-4)}`}
                  </code>
                </div>

                {/* Balance */}
                {balance && (
                  <div className='bg-white rounded-lg p-4'>
                    <label className='text-xs font-medium text-gray-600 mb-2 block'>Balance</label>
                    <p className='text-lg font-semibold text-[#290E0A]'>
                      {balance} ETH
                    </p>
                  </div>
                )}

                {/* Network Info */}
                {networkInfo && (
                  <div className='bg-white rounded-lg p-4'>
                    <label className='text-xs font-medium text-gray-600 mb-2 block'>Network</label>
                    <p className='text-sm text-[#290E0A] font-medium'>{networkInfo.name}</p>
                    <p className='text-xs text-gray-500'>Chain ID: {networkInfo.chainId}</p>
                  </div>
                )}

                {/* Wallet Status */}
                <div className='bg-white rounded-lg p-4'>
                  <label className='text-xs font-medium text-gray-600 mb-2 block'>Wallet Status</label>
                  <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-sm text-[#290E0A]'>Connected</span>
                  </div>
                </div>

                {/* Wallet Type */}
                {account.isInstalled && (
                  <div className='bg-white rounded-lg p-4'>
                    <label className='text-xs font-medium text-gray-600 mb-2 block'>Wallet Type</label>
                    <p className='text-sm text-[#290E0A] font-medium'>MetaMask</p>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-[#290E0A] mb-4'>No wallet connected</p>
                <button
                  onClick={account.connect}
                  className='px-6 py-2 bg-[#693422] text-white rounded hover:bg-[#693422]/90 transition-colors'
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Contract Information */}
          {contractAddress && (
            <div className='bg-[#F6E7CA] rounded-lg shadow-lg p-6 mb-6'>
              <h2 className='text-2xl font-semibold text-[#290E0A] mb-4'>Contract Information</h2>
              <div className='bg-white rounded-lg p-4'>
                <label className='text-xs font-medium text-gray-600 mb-2 block'>Contract Address</label>
                <div className='flex items-center justify-between'>
                  <code className='text-sm text-[#290E0A] font-mono break-all'>
                    {contractAddress}
                  </code>
                  <button
                    onClick={() => copyToClipboard(contractAddress)}
                    className='ml-4 px-3 py-1 bg-[#693422] text-white text-xs rounded hover:bg-[#693422]/90 transition-colors'
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          {account.data && (
            <div className='bg-[#F6E7CA] rounded-lg shadow-lg p-6'>
              <h2 className='text-2xl font-semibold text-[#290E0A] mb-4'>Actions</h2>
              <div className='space-y-3'>
                <button
                  onClick={() => copyToClipboard(account.data!)}
                  className='w-full px-4 py-2 bg-[#693422] text-white rounded hover:bg-[#693422]/90 transition-colors text-sm'
                >
                  Copy Address
                </button>
                {networkInfo && networkInfo.chainId === '1' && (
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${account.data}`, '_blank')}
                    className='w-full px-4 py-2 bg-white border border-[#693422] text-[#693422] rounded hover:bg-gray-50 transition-colors text-sm'
                  >
                    View on Etherscan
                  </button>
                )}
                {networkInfo && networkInfo.chainId !== '1' && (
                  <p className='text-xs text-gray-500 text-center'>
                    Etherscan is only available for Mainnet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <Web3Provider>
      <ProfileContent />
    </Web3Provider>
  )
}

export default ProfilePage


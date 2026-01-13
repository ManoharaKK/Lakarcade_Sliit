"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/navbar'
import { useWeb3 } from '@/components/providers/web3'

function MarketplaceContent() {
  const { provider, ethereum } = useWeb3();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    async function getWalletInfo() {
      if (provider && ethereum) {
        try {
          // Get accounts
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const address = accounts[0].address;
            setWalletAddress(address);
            setIsConnected(true);

            // Get balance
            const balance = await provider.getBalance(address);
            const balanceInEth = (Number(balance) / 1e18).toFixed(4);
            setBalance(balanceInEth);

            // Get chain ID
            const network = await provider.getNetwork();
            setChainId(network.chainId.toString());
          } else {
            setIsConnected(false);
          }
        } catch (error) {
          console.error('Error getting wallet info:', error);
        }
      } else if (typeof window !== 'undefined' && window.ethereum) {
        // Fallback: request accounts directly
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error: any) {
          // User rejection (4001) is expected behavior, not an error
          if (error?.code !== 4001) {
            console.error('Error connecting wallet:', error);
          }
        }
      }
    }

    getWalletInfo();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: unknown) => {
        const accountArray = accounts as string[];
        if (accountArray && accountArray.length > 0) {
          setWalletAddress(accountArray[0]);
          setIsConnected(true);
        } else {
          setWalletAddress(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [provider, ethereum]);

  return (
    <div className='min-h-screen bg-darkbrown pt-[180px]'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-white mb-8'>Marketplace</h1>
        
        {isConnected && walletAddress ? (
          <div className='bg-primary border-2 border-lightbrown rounded-lg p-6 mb-8 shadow-lg'>
            <h2 className='text-2xl font-bold text-blackbrown mb-4'>Wallet Details</h2>
            <div className='space-y-3'>
              <div>
                <p className='text-sm font-semibold text-blackbrown mb-1'>Wallet Address:</p>
                <p className='text-base font-mono text-blackbrown break-all bg-white px-3 py-2 rounded'>
                  {walletAddress}
                </p>
                <p className='text-xs text-lightbrown mt-1'>Short: {formatAddress(walletAddress)}</p>
              </div>
              
              {balance && (
                <div>
                  <p className='text-sm font-semibold text-blackbrown mb-1'>Balance:</p>
                  <p className='text-base text-blackbrown font-semibold'>{balance} ETH</p>
                </div>
              )}
              
              {chainId && (
                <div>
                  <p className='text-sm font-semibold text-blackbrown mb-1'>Chain ID:</p>
                  <p className='text-base text-blackbrown'>{chainId}</p>
                </div>
              )}
              
              <div>
                <p className='text-sm font-semibold text-blackbrown mb-1'>Status:</p>
                <p className='text-base text-green-600 font-semibold'>✓ Connected</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-primary border-2 border-lightbrown rounded-lg p-6 mb-8 shadow-lg'>
            <p className='text-blackbrown text-lg'>No wallet connected</p>
            <p className='text-lightbrown text-sm mt-2'>Please connect your MetaMask wallet to view details.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function page() {
  return <MarketplaceContent />
}
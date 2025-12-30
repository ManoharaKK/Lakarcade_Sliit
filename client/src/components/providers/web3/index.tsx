"use client";

import { createContext, FunctionComponent, ReactNode, useContext, useState, useEffect, useRef } from "react";
import { ethers, BrowserProvider } from "ethers";
import { createDefaultState, Web3State, loadContract, createWeb3State } from "./utils";


const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initRef.current) return;
    initRef.current = true;

    async function initWeb3() {
      // Ensure we're on the client side
      if (typeof window === 'undefined' || !window.ethereum) {
        console.log("MetaMask not installed or not in browser");
        setWeb3Api(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        
        // Only check for existing accounts (doesn't trigger popup)
        // Don't request accounts automatically - let user click "Connect Wallet" button
        // This prevents MetaMask popup on page load

        const contract = await loadContract("NftMarket", provider);
        
        setWeb3Api(createWeb3State({ 
          ethereum: window.ethereum, 
          provider, 
          contract, 
          isLoading: false 
        }));
      } catch (error: any) {
        // Handle specific MetaMask errors with clear messages
        if (error?.code === 4001) {
          console.log("User rejected MetaMask request");
        } else if (error?.code === -32002) {
          console.log("MetaMask request already pending");
        } else {
          console.error("Error initializing Web3:", error);
        }
        setWeb3Api(prev => ({ ...prev, isLoading: false }));
      }
    }

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>
      {children}
    </Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}
export function useHooks() {
  const {hooks} = useWeb3();
  return hooks;
}

export default Web3Provider;

"use client";

import { createContext, FunctionComponent, ReactNode, useContext, useState, useEffect, useRef } from "react";
import { ethers, BrowserProvider } from "ethers";
import { createDefaultState, Web3State, loadContract, createWeb3State } from "./utils";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@_types/nftMarketContract";

const pageReload = () => { window.location.reload(); }

const handleAccount = (ethereum: MetaMaskInpageProvider) =>  async () => {
  const isLocked = !(await ethereum._metamask.isUnlocked());
  if (isLocked) { pageReload(); }

}

const setGlobalListener = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged",pageReload );
  ethereum.on("accountsChanged",handleAccount(ethereum) );
}

const removeGlobalListener = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged",pageReload );
  ethereum?.removeListener("accountsChanged",handleAccount );
}

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
        
        // Get signer and create signed contract for write operations
        // Only if accounts are available (user has connected wallet)
        let signedContract = contract as unknown as NftMarketContract;
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            signedContract = contract.connect(signer) as unknown as NftMarketContract;
          }
        } catch (signerError) {
          // No accounts connected yet, use read-only contract
          console.log("No signer available, using read-only contract");
        }
        
        setTimeout(() => { setGlobalListener(window.ethereum); }, 500);

        setWeb3Api(createWeb3State({ 
          ethereum: window.ethereum, 
          provider, 
          contract: signedContract,
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
    return () => removeGlobalListener(window.ethereum);
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

"use client";

import { createContext, FunctionComponent, ReactNode, useContext, useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { createDefaultState, Web3State } from "./utils";

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      setWeb3Api({
        ethereum: window.ethereum,
        provider,
        contract: null,
        isLoading: false
      });
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

export default Web3Provider;

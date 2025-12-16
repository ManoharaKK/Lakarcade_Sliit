import { MetaMaskInpageProvider } from "@metamask/providers";
import { BrowserProvider, Contract } from "ethers";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

export type Web3Params = {
    ethereum: MetaMaskInpageProvider | null;
    provider: BrowserProvider | null;
    contract: Contract | null;
  };

  export type Web3State = {
    isLoading: boolean; // true while loading web3State
  } & Web3Params

  export const createDefaultState = () => {
    return {
        isLoading: true,
        ethereum: null,
        provider: null,
        contract: null,
    }
  }
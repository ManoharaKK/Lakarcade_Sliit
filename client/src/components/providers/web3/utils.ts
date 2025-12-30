import { Web3Hooks, SetupHooks } from "@/components/hooks/web3/setupHooks";
import { web3Dependencies } from "@_types/hook";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { BrowserProvider, Contract } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
  hooks: Web3Hooks;
} & Nullable<web3Dependencies>;



export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: SetupHooks({ 
      ethereum: null, 
      provider: null, 
      contract: null, 
      isLoading: true 
    } as any)
  }
}

export const createWeb3State = ({
  ethereum, provider, contract, isLoading
}: web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: SetupHooks({ ethereum, provider, contract, isLoading })
  }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,  // NftMarket
  provider: BrowserProvider
): Promise<Contract> => {
  
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    )

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
}
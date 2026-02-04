import { MetaMaskInpageProvider } from "@metamask/providers";
import { BrowserProvider, Contract } from "ethers";
import { SWRResponse } from "swr";
import { NftMarketContract } from "./nftMarketContract";

export type web3Dependencies = {
    ethereum: MetaMaskInpageProvider;
    provider: BrowserProvider;
    contract: NftMarketContract;
    isLoading: boolean;
}

export type CryptoHookFactory<D = any, R = any, P = any> = (
    d: Partial<web3Dependencies>
) => CryptoHandlerHook <D, R, P>;

export type CryptoHandlerHook <D = any, R = any, P = any> = (params?: P) => CryptoResponse<D, R>;

export type CryptoResponse<D = any, R = any> = SWRResponse<D> & R;






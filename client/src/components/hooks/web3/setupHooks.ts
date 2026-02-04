
import { web3Dependencies } from "@_types/hook";
import { hookFactory as createAccountHook, useAccountHook } from "./userAccount";
import { hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";
import { hookFactory as createListedNftsHook, UseListedNftsHook } from "./useListedNfts";
import { hookFactory as createOwnedNftsHook, UseOwnedNftsHook } from "./useOwnedNft";

export type Web3Hooks = {
    useAccount: useAccountHook;
    useNetwork: UseNetworkHook;
    useListedNfts: UseListedNftsHook;
    useOwnedNfts: UseOwnedNftsHook;
}
export type SetupHooks = {
    (d: web3Dependencies): Web3Hooks;
}
export const SetupHooks: SetupHooks = (deps) => {
    
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
        useListedNfts: createListedNftsHook(deps),
        useOwnedNfts: createOwnedNftsHook(deps),
    }
}
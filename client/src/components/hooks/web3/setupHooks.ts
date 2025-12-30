
import { web3Dependencies } from "@_types/hook";
import { hookFactory as createAccountHook, useAccountHook } from "./userAccount";
import { hookFactory as createNetworkHook, useNetworkHook } from "./useNetwork";

export type Web3Hooks = {
    useAccount: useAccountHook;
    useNetwork: useNetworkHook;
}
export type SetupHooks = {
    (d: web3Dependencies): Web3Hooks;
}
export const SetupHooks: SetupHooks = (deps) => {
    
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
    }
}
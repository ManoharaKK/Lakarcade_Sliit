import useSWR, { mutate } from "swr";
import { useEffect } from "react";
import { CryptoHookFactory } from "@_types/hook";

type UseAccountResponse = {
    connect: () => Promise<void>;
    isLoading: boolean;
    isInstalled: boolean;
}

type AccountHookFactory = CryptoHookFactory<string | undefined, UseAccountResponse>

export type useAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider, ethereum, isLoading}) => () =>{
   const{data, mutate, isValidating, ...swr} = useSWR(
        provider ? "web3/useAccount" : null,
        async () => {
            console.log("REVALIDATING!!!!");
            const accounts = await provider!.listAccounts();
            const account = accounts[0];

            // If no account (MetaMask locked), return undefined instead of throwing
            // This allows UI to show "Connect Wallet" button
            if (!account) {
                return undefined;
            }
            
            return account?.address;
        },
        {
            revalidateOnFocus: false
        }
    );
    
    const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
            // MetaMask is locked/logged out - clear the account data
            console.log("MetaMask account locked or logged out");
            // Clear the cache by setting data to undefined
            mutate(undefined, { revalidate: false });
        } else if (accounts[0] !== data) {
            mutate(accounts[0]);
        }
    }
      
    useEffect(() => {
        if (!ethereum) return;
        
        ethereum.on("accountsChanged", handleAccountsChanged);
        return () => {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
    }, [ethereum, data, mutate])


    
    const connect = async () => {
        if (!ethereum) {
            console.error("MetaMask is not installed");
            return;
        }

        try {
            // This will open MetaMask login popup
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error: any) {
            // Handle specific MetaMask errors gracefully
            if (error.code === 4001) {
                console.log("User rejected MetaMask connection");
            } else if (error.code === -32002) {
                console.log("MetaMask request already pending - please check MetaMask");
            } else {
                console.error("Error connecting wallet:", error);
            }
        }
    }
    
    return {
    ...swr,
    data,
    isValidating,
    isLoading: isLoading || isValidating,
    isInstalled: ethereum?.isMetaMask || false,
    mutate,
    connect
};
}

import { useEffect, useState } from "react";
import { CryptoHookFactory } from "@_types/hook";

type UseAccountResponse = {
    connect: () => Promise<void>;
    isLoading: boolean;
    isInstalled: boolean;
    wasDisconnected: boolean;
}

type AccountHookFactory = CryptoHookFactory<string | undefined, UseAccountResponse>

export type useAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider, ethereum, isLoading}) => () => {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [checking, setChecking] = useState(true);
    const [wasDisconnected, setWasDisconnected] = useState(false);
    
    // Check for existing connection on mount (won't trigger popup)
    useEffect(() => {
        if (!ethereum) {
            setChecking(false);
            return;
        }
        
        const checkConnection = async () => {
            try {
                const accounts = await ethereum.request({ 
                    method: "eth_accounts" 
                }) as string[];
                
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    setWasDisconnected(false);
                } else {
                    setAccount(undefined);
                }
            } catch (error) {
                console.log("Error checking existing connection:", error);
                setAccount(undefined);
            } finally {
                setChecking(false);
            }
        };
        
        checkConnection();
    }, [ethereum]);
    
    // Periodic check for lock status - CRITICAL FOR DETECTING METAMASK LOCK
    useEffect(() => {
        if (!ethereum || !account) return;
        
        const checkLockStatus = async () => {
            try {
                const accounts = await ethereum.request({ 
                    method: "eth_accounts" 
                }) as string[];
                
                // If no accounts but we think we're connected, wallet is locked
                if (!accounts || accounts.length === 0) {
                    console.log("MetaMask locked - clearing account");
                    setAccount(undefined);
                    setWasDisconnected(true);
                } else if (accounts[0] !== account) {
                    // Account changed
                    console.log("Account changed");
                    setAccount(accounts[0]);
                }
            } catch (error) {
                console.log("Error checking lock status:", error);
                setAccount(undefined);
                setWasDisconnected(true);
            }
        };
        
        
    }, [ethereum, account]);
    
    // Listen for account changes and disconnections
    useEffect(() => {
        if (!ethereum) return;
        
        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            console.log("accountsChanged event:", accounts);
            
            if (accounts.length === 0) {
                console.log("MetaMask account locked or logged out");
                setAccount(undefined);
                setWasDisconnected(true);
            } else {
                setAccount(accounts[0]);
                setWasDisconnected(false);
            }
        }
        
        const handleDisconnect = () => {
            console.log("MetaMask disconnected event");
            setAccount(undefined);
            setWasDisconnected(true);
        }
        
        const handleChainChanged = () => {
            console.log("Chain changed");
            checkAccounts();
        }
        
        const checkAccounts = async () => {
            try {
                const accounts = await ethereum.request({ 
                    method: "eth_accounts" 
                }) as string[];
                
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    setWasDisconnected(false);
                } else {
                    setAccount(undefined);
                    setWasDisconnected(true);
                }
            } catch (error) {
                console.log("Error checking accounts:", error);
                setAccount(undefined);
                setWasDisconnected(true);
            }
        }
        
        ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on("disconnect", handleDisconnect);
        ethereum.on("chainChanged", handleChainChanged);
        
        return () => {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
            ethereum.removeListener("disconnect", handleDisconnect);
            ethereum.removeListener("chainChanged", handleChainChanged);
        }
    }, [ethereum])

    const connect = async () => {
        if (!ethereum) {
            console.error("MetaMask is not installed");
            return;
        }

        try {
            const accounts = await ethereum.request({ 
                method: "eth_requestAccounts" 
            }) as string[];
            
            if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                setWasDisconnected(false);
            }
        } catch (error: any) {
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
        data: account,
        isValidating: checking,
        isLoading: isLoading as boolean,
        isInstalled: ethereum?.isMetaMask || false,
        wasDisconnected,
        error: undefined,
        mutate: async () => account,
        connect
    };
}
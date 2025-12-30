import useSWR, { mutate } from "swr";
import { CryptoHookFactory } from "@_types/hook";

const NETWORKS: {[k: number]: string} = {
    1: "Ethereum Main Network",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    42: "Kovan",
    56: "BSC Main Network",
    11155111: "Sepolia",
    5777: "Ganache Local",
    1337: "Localhost"
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID;
const targetNetwork = targetId ? NETWORKS[Number(targetId)] : undefined;

type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string | undefined;
}

type NetworkHookFactory = CryptoHookFactory<string | undefined, UseNetworkResponse>

export type useNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () =>{
   const{data, isValidating, ...swr} = useSWR<string | undefined>(
        provider ? "web3/useNetwork" : null,
        async () => {
            const chainId = (await provider!.getNetwork()).chainId;
            
            
            if (!chainId) {
                throw "Canot retrieve network. Please, refresh or connect to a other network";
            }
            return NETWORKS[Number(chainId)];
        },
        {
            revalidateOnFocus: false
        }
    );
    return {
    ...swr,
    data,
    isValidating,
    targetNetwork,
    isSupported: data === targetNetwork,
    isLoading: isLoading || isValidating,
    
};
}

import useSWR from "swr";
import { CryptoHookFactory } from "@_types/hook";

const NETWORKS: {[key: number]: string} = {
  1: "Ethereum Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
  56: "BSC Mainnet",
  1337: "Localhost",
  5777: "Ganache Local",
  11155111: "Sepolia"
}

// Support both network IDs for local development
const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const networkId = process.env.NEXT_PUBLIC_NETWORK_ID as string;

const targetNetwork = NETWORKS[Number(targetId)];
const allowedNetworks = [
  NETWORKS[Number(targetId)],
  NETWORKS[Number(networkId)]
].filter(Boolean); // Remove undefined values

console.log("Network Configuration:", {
  targetId,
  networkId,
  targetNetwork,
  allowedNetworks
});

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string | undefined;
  allowedNetworks?: string[];
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {
  const {data, isValidating, error, ...swr} = useSWR(
    provider ? "web3/useNetwork" : null,
    async () => {
        const network = await provider!.getNetwork();
        
        if(!network) {
          throw new Error("Cannot get network. Please check if you are connected to the network");
        }

        const chainId = Number(network.chainId);
        const networkName = NETWORKS[chainId] || `Network ${chainId}`;
        
        console.log("Current Network:", {
          chainId,
          networkName,
          targetNetwork,
          allowedNetworks,
          isInAllowed: allowedNetworks.includes(networkName)
        });
        
        return networkName;
    }, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )

  // Check if current network is in allowed networks list
  const isSupported = data ? allowedNetworks.includes(data) : false;

  console.log("Network Support Check:", {
    currentNetwork: data,
    targetNetwork,
    allowedNetworks,
    isSupported
  });

  return {
    ...swr,
    data,
    error,
    isValidating,
    targetNetwork,
    allowedNetworks,
    isSupported,
    isLoading: isLoading as boolean,
  };
}
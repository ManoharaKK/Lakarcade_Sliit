import { useWeb3 } from "@/components/providers/web3";

export const useAccount = () => {
    const {hooks} = useWeb3();
    const swrRes = hooks.useAccount();

    return{
        account: swrRes
    }
}

export const useNetwork = () => {
    const {hooks} = useWeb3();
    const swrRes = hooks.useNetwork();

    return{
        network: swrRes
    }
}
export const useListedNfts = () => {
    const {hooks} = useWeb3();
    const swrRes = hooks.useListedNfts();

    return{
        nfts: swrRes
    }
}

export const useOwnedNfts = () => {
    const {hooks} = useWeb3();
    const swrRes = hooks.useOwnedNfts();

    return{
        nfts: swrRes
    }
}
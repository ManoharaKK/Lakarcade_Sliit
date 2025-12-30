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
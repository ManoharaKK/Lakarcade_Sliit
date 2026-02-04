import { CryptoHookFactory } from "@_types/hook";
import useSWR from "swr";
import { Nft } from "@_types/nft";
import { formatEther, parseEther } from "ethers";
import { useCallback } from "react";

type UseListedNftsResponse = {
  buyNft: (token: number, value: number) => Promise<void>;
}

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>
export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      if (!contract) return [];
      const nfts = [] as Nft[];
      const coreNfts = await contract.getAllNftsOnSale();
      
      for  (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        
        try {
          // Get tokenId - handle both bigint and BigNumber
          const tokenIdValue = typeof item.tokenId === 'bigint' 
            ? Number(item.tokenId)
            : typeof (item.tokenId as any)?.toNumber === 'function'
              ? (item.tokenId as any).toNumber()
              : Number(item.tokenId);
          
          const tokenURI = await contract!.tokenURI(tokenIdValue);
          console.log(`Token ${tokenIdValue} URI:`, tokenURI);
          
          let meta = null;
          try {
            const metaRes = await fetch(tokenURI);
            if (metaRes.ok) {
              meta = await metaRes.json();
              console.log(`Token ${tokenIdValue} metadata:`, meta);
            }
          } catch (metaError) {
            console.error(`Error fetching metadata for token ${tokenIdValue}:`, metaError);
          }

          // Convert ethers v5 BigNumber to string for ethers v6 formatEther
          // Type assertion needed because contract types use ethers v5 BigNumber
          const priceValue = (item.price as any)?.toString?.() ?? String(item.price);
          const priceInEth = parseFloat(formatEther(priceValue));
          
          const nftData = {
            price: priceInEth,
            tokenId: tokenIdValue,
            creator: item.creator,
            isListed: item.isListed,
            meta: meta || {
              name: `NFT #${tokenIdValue}`,
              description: `A unique creature NFT`,
              image: '/images/placeholder.png',
              attributes: []
            }
          };
          
          console.log(`Processed NFT ${tokenIdValue}:`, nftData);
          nfts.push(nftData);
        } catch (error) {
          console.error(`Error processing NFT at index ${i}:`, error);
        }
      }
      
      console.log("Total NFTs processed:", nfts.length);

      
      return nfts;
    }
  )

  const buyNft = useCallback (async (tokenId: number, value: number) => {
    try{
      const result = await (contract as any)?.buyNft(
        tokenId,
        { value: parseEther(value.toString()) }
      );
      await result.wait();

      alert("You have bought the NFT.see profile page");

    }catch(e: any){
      console.error("Error buying NFT:", e);
    }
  }, [contract])
  return {
    ...swr,
    buyNft,
    data: data || [],
  };
}
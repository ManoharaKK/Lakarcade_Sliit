import { useCallback } from "react";
import { CryptoHookFactory } from "@_types/hook";
import useSWR from "swr";
import { Nft } from "@_types/nft";
import { formatEther, parseEther } from "ethers";


type UseOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
}
type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>
export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useOwnedNfts" : null,
    async () => {
      if (!contract) return [];
      const nfts = [] as Nft[];
      const coreNfts = await contract.getOwnedNfts();
      
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

  const _contract = contract as any;
  const listNft = useCallback (async (tokenId: number, price: number) => {
    try {
      const result = await _contract!.placeNftOnSale(
        tokenId,
        parseEther(price.toString()),
        { value: parseEther("0.025") }
      );

      await result.wait();

      alert("You have listed the NFT. See profile page.");
    } catch (e: any) {
      console.error("Error listing NFT:", e);
    }
  }, [_contract])

  return {
    ...swr,
    listNft,
    data: data || [],
  };
}
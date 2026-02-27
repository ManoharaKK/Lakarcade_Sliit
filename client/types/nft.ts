export type Trait = "membershipLevel" | "accessLevel" | "resourceUnlockScore";

export type NftAttribute = {
  trait_type: Trait;
  value: string;
};

export const MEMBERSHIP_LEVEL_OPTIONS = [
  "Basic", "Standard", "Premium", "VIP", "Patron",
] as const;

export const ACCESS_LEVEL_OPTIONS = [
  "View", "Member", "Contributor", "Curator", "Admin",
] as const;

export const RESOURCE_UNLOCK_SCORE_OPTIONS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
] as const;

export const ARTIFACT_TYPE_OPTIONS = [
  "Sculpture", "Painting", "Textile", "Pottery", "Metalwork",
  "Manuscript", "Jewelry", "Woodwork", "Other",
] as const;

export const COMMUNITY_PERKS_OPTIONS = [
  "Community access",
  "Rare books",
  "Event access",
  "Expert talk",
  "Heritage site visits",
  "Exclusive content",
  "Member discount",
] as const;

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
  collectionName?: string;
  collectionYear?: string;
  pieceNumber?: string;
  totalPiecesInCollection?: string;
  originLocation?: string;
  historicalPeriod?: string;
  artifactType?: string;
  mintPriceEth?: string;
  usdEquivalent?: string;
  communityPerks?: string[];
  sourceReference?: string;
  disclaimer?: string;
};

export type NftCore = {
    tokenId: number;
    price: number;
    /** Exact listing price in wei (string) for buyNft - use this to avoid rounding */
    priceWei?: string;
    creator: string;
    isListed: boolean;
};

export type Nft = {
    meta: NftMeta;
} & NftCore;

export type FileRequest = {
    bytes: Uint8Array;
    contentType: string;
    filename: string;
};
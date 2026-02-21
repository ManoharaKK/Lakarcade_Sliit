import { ethers } from "ethers";
import { Session, withIronSession } from "next-iron-session";
import * as util from "ethereumjs-util";
import contract from "../../../public/contracts/NftMarket.json";
import { NextApiRequest, NextApiResponse } from "next";
import { NftMarketContract } from "../../../types/nftMarketContract";
import { Buffer } from "buffer";

// ABI
const abi = contract.abi;

// Network type from contract JSON
type NetworkMap = typeof contract.networks;

// Network ID from env
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NetworkMap;

// Contract address
export const contractAddress = contract.networks[targetNetwork]?.address;
export const pinataApiKey = process.env.PINATA_API_KEY as string;
// Support both names: Pinata docs use PINATA_SECRET_API_KEY; some envs use PINATA_SECRET_KEY
export const pinataSecretApiKey = (process.env.PINATA_SECRET_API_KEY ?? process.env.PINATA_SECRET_KEY) as string;

if (!contractAddress) {
  throw new Error("Contract address not found for this network");
}


export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}

// Middleware
export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) => {
  const message = req.session.get("message-session");
  if (!message || !req.body?.signature || !req.body?.address) {
    throw new Error("Missing session message or signature. Please complete step 1 (GET /api/verify) first with the same browser session.");
  }

  const messageStr = JSON.stringify(message);
  const messageBytes = Buffer.from(messageStr, "utf-8");
  const prefix = "\x19Ethereum Signed Message:\n" + messageBytes.length;
  const nonce = util.keccak(Buffer.concat([Buffer.from(prefix, "utf-8"), messageBytes]));

  const { v, r, s } = util.fromRpcSig(req.body.signature);
  const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
  const addrBuffer = util.pubToAddress(pubKey);
  const recoveredAddress = util.bufferToHex(addrBuffer);

  // Compare addresses case-insensitively (EIP-55 checksum can differ)
  if (recoveredAddress.toLowerCase() !== (req.body.address as string).toLowerCase()) {
    throw new Error("Wrong Address");
  }
  return "Correct Address";
};

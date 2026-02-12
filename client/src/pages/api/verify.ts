import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import {
  addressCheckMiddleware,
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
  withSession,
} from "@/app/api/utils";
import { NftMeta } from "../../../types/nft";
import axios from "axios";

export default withSession(async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const body = req.body ?? {};
      const nft = body.nft as NftMeta;

      if (!nft?.name || !nft?.description || !nft?.attributes) {
        return res.status(422).json({ message: "Some of form data is missing" });
      }

      await addressCheckMiddleware(req, res);

      // Validate Pinata credentials before making request
      if (!pinataApiKey || !pinataSecretApiKey) {
        return res.status(500).json({
          message: "Pinata API credentials are not configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables.",
        });
      }

      const jsonRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataMetadata: {
            name: uuidv4(),
          },
          pinataContent: nft,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "pinata_api_key": pinataApiKey,
            "pinata_secret_api_key": pinataSecretApiKey,
          },
        }
      );

      return res.status(200).json(jsonRes.data);
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: unknown; status?: number } };
      console.error("Verify/Pinata error:", err);
      
      // Extract error message from Pinata response format
      let msg = err.message ?? "Cannot create a JSON";
      if (err.response?.data != null && typeof err.response.data === "object" && err.response.data !== null) {
        const data = err.response.data as Record<string, unknown>;
        // Pinata error format: { reason: "...", details: "..." }
        if ("details" in data && typeof data.details === "string") {
          msg = data.details;
        } else if ("reason" in data && typeof data.reason === "string") {
          msg = data.reason;
        } else if ("error" in data && typeof data.error === "string") {
          msg = data.error;
        } else if ("message" in data && typeof data.message === "string") {
          msg = data.message;
        } else {
          msg = JSON.stringify(err.response.data);
        }
      }
      
      return res.status(422).json({ message: msg });
    }
  } else if (req.method === "GET") {
    try {
      const message = { contractAddress, id: uuidv4() };
      req.session.set("message-session", message);
      await req.session.save();

      return res.json(message);
    } catch (error) {
      console.error("Error generating a message:", error);
      return res.status(422).json({ message: "Cannot generate a message" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
});

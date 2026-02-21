import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { addressCheckMiddleware, contractAddress, pinataApiKey, pinataSecretApiKey, withSession } from "./utils";
import { NftMeta } from "../../../types/nft";
import axios from "axios";

export default withSession(async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { body } = req;
      const nft = body.nft as NftMeta;

      if (!nft.name || !nft.description || !nft.attributes) {
        return res.status(422).send({ message: "Some of form data is missing" });
      }

      await addressCheckMiddleware(req, res);

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
            "pinata_api_key": pinataApiKey,
            "pinata_secret_api_key": pinataSecretApiKey,
          },
        }
      );

      return res.status(200).json(jsonRes.data);

    } catch (error) {
      console.error("Error verifying signature:", error);
      return res.status(422).send({ message: "Cannot create a JSON" });
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
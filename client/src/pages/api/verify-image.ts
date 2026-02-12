import { v4 as uuidv4 } from "uuid";
import { addressCheckMiddleware, pinataApiKey, pinataSecretApiKey, withSession } from "@/app/api/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { FileRequest } from "../../../types/nft";
import FormData from "form-data";
import axios from "axios";

export default withSession(async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse
) => {
    if (req.method === "POST") {
        try {
            const {
                bytes,
                filename,
                contentType,
            } = req.body as FileRequest;

            if (!bytes || !filename || !contentType) {
                return res.status(422).json({ message: "Image data are missing" });
            }
            await addressCheckMiddleware(req, res);
            const buffer = Buffer.from(Object.values(bytes));
            const formData = new FormData();
            formData.append("file", buffer, {
                contentType,
                filename: filename + "-" + uuidv4()

            });
            const fileRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: Infinity,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
                    "pinata_api_key": pinataApiKey,
                    "pinata_secret_api_key": pinataSecretApiKey,
                },
            });


            

            return res.status(200).json(fileRes.data);
        } catch (error) {
            console.error("verify-image error:", error);
            const message = error instanceof Error ? error.message : "Image upload failed";
            return res.status(422).json({ message });
        }
    } else {
        return res.status(422).json({ message: "Invalid endpoint" });
    }
});
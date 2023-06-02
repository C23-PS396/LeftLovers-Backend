import { Storage } from "@google-cloud/storage";
import { Request, Response } from "express";
import {
  BUCKET_NAME,
  GOOGLE_APPLICATION_CREDENTIALS,
} from "../../../config/config";

const storage = new Storage({
  projectId: BUCKET_NAME,
  credentials: JSON.parse(GOOGLE_APPLICATION_CREDENTIALS),
});

const bucket = storage.bucket("bucket-ps396");

export const uploadFileHandler = (req: Request, res: Response) => {
  try {
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blockStream = blob.createWriteStream();
      blockStream.on("finish", (e: any) => {
        res.status(200).send("success");
      });
      blockStream.end(req.file.buffer);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

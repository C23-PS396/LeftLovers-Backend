import { Router } from "express";
import { verifyToken } from "../../middleware/authJwt";
import Multer from "multer";
import { uploadFileHandler } from "../../handler/uploadFileHandler/uploadFileHandler";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const router = Router();

router.post("/", [multer.single("imgFile")], uploadFileHandler);

export default router;

import { Router } from "express";
import { upload } from "./media.controller.js";
import { uploadMediaFile } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/", uploadMediaFile.single("file"), upload);

export default router;

import { Router } from "express";
import { list, create, update, remove } from "./product.controller.js";
import { uploadProductImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", list);
router.post("/", uploadProductImage.single("image"), create);
router.put("/", uploadProductImage.single("image"), update);
router.delete("/", remove);

export default router;

import { Router } from "express";
import { list, create, update, remove } from "./marketing.controller.js";

const router = Router();

router.get("/", list);
router.post("/", create);
router.put("/", update);
router.delete("/", remove);

export default router;

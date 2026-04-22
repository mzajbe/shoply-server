import { Router } from "express";
import { list, create, updateStatus } from "./order.controller.js";

const router = Router();

router.get("/", list);
router.post("/", create);
router.patch("/", updateStatus);

export default router;

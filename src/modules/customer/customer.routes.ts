import { Router } from "express";
import { list, create, remove } from "./customer.controller.js";

const router = Router();

router.get("/", list);
router.post("/", create);
router.delete("/", remove);

export default router;

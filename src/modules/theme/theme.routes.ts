import { Router } from "express";
import { get, save } from "./theme.controller.js";

const router = Router();

router.get("/", get);
router.post("/", save);

export default router;

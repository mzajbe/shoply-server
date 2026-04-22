import { Router } from "express";
import { list } from "./stats.controller.js";

const router = Router();

router.get("/", list);

export default router;

import { Router } from "express";
import { setup } from "./setup.controller.js";

const router = Router();

router.get("/", setup);

export default router;

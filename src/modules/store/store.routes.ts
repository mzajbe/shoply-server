import { Router } from "express";
import {
  create,
  list,
  getById,
  getBySubdomain,
  listByOwner,
  update,
  remove,
} from "./store.controller.js";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/owner/:ownerId", listByOwner);
router.get("/subdomain/:subdomain", getBySubdomain);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;

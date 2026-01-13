import { Router } from "express";
import {
  create,
  list,
  listByStore,
  getById,
  update,
  remove,
} from "./category.controller.js";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/store/:storeId", listByStore);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;

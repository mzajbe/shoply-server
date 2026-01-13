// src/app.ts
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import storeRoutes from "./modules/store/store.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

export default app;

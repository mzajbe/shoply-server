// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Module routes
import authRoutes from "./modules/auth/auth.routes.js";
import storeRoutes from "./modules/store/store.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import customerRoutes from "./modules/customer/customer.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import marketingRoutes from "./modules/marketing/marketing.routes.js";
import themeRoutes from "./modules/theme/theme.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import setupRoutes from "./modules/setup/setup.routes.js";

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files as static assets
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// ─── Routes ─────────────────────────────────────────────────
// Auth
app.use("/api/auth", authRoutes);

// Dashboard
app.use("/api/dashboard/products", productRoutes);
app.use("/api/dashboard/orders", orderRoutes);
app.use("/api/dashboard/customers", customerRoutes);
app.use("/api/dashboard/stats", statsRoutes);
app.use("/api/dashboard/settings", settingsRoutes);
app.use("/api/dashboard/marketing", marketingRoutes);

// Features
app.use("/api/themes", themeRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/setup-db", setupRoutes);

// Store & Category (Express demo modules)
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);

// ─── Health check ───────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error Handler (must be last) ───────────────────────────
app.use(errorHandler);

export default app;

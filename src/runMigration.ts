import { pool } from "./config/db.js";

async function run() {
  try {
    await pool.query("ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS payment_sslcommerze BOOLEAN DEFAULT false;");
    await pool.query("ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS payment_aamarpay BOOLEAN DEFAULT false;");
    await pool.query("ALTER TABLE store_settings DROP COLUMN IF EXISTS payment_paypal;");
    console.log("Migration successful");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();

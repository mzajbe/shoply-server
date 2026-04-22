import { pool } from "../../config/db.js";

export const getSettings = async () => {
  const result = await pool.query("SELECT * FROM store_settings LIMIT 1");

  if (result.rows.length === 0) {
    return {
      store_name: "",
      currency: "USD",
      email: "",
      payment_stripe: false,
      payment_sslcommerze: false,
      payment_aamarpay: false,
      shipping_rate: "0.00",
      notifications_email: true,
    };
  }

  return result.rows[0];
};

export const updateSettings = async (payload: {
  store_name: string;
  currency: string;
  email: string;
  payment_stripe: boolean;
  payment_sslcommerze: boolean;
  payment_aamarpay: boolean;
  shipping_rate: string;
  notifications_email: boolean;
}) => {
  const {
    store_name,
    currency,
    email,
    payment_stripe,
    payment_sslcommerze,
    payment_aamarpay,
    shipping_rate,
    notifications_email,
  } = payload;

  const check = await pool.query("SELECT id FROM store_settings LIMIT 1");

  if (check.rows.length > 0) {
    await pool.query(
      `UPDATE store_settings SET 
        store_name=$1, 
        currency=$2, 
        email=$3,
        payment_stripe=$4,
        payment_sslcommerze=$5,
        payment_aamarpay=$6,
        shipping_rate=$7,
        notifications_email=$8
       WHERE id=$9`,
      [
        store_name,
        currency,
        email,
        payment_stripe,
        payment_sslcommerze,
        payment_aamarpay,
        shipping_rate,
        notifications_email,
        check.rows[0].id,
      ]
    );
  } else {
    await pool.query(
      `INSERT INTO store_settings (
        store_name, currency, email, payment_stripe, payment_sslcommerze, payment_aamarpay, shipping_rate, notifications_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        store_name,
        currency,
        email,
        payment_stripe,
        payment_sslcommerze,
        payment_aamarpay,
        shipping_rate,
        notifications_email,
      ]
    );
  }

  return { message: "Settings updated" };
};

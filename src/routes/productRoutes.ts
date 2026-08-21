import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Product } from "../types";

const router = Router();

// GET /api/v1/products
// Supports optional ?category filter
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    if (category) {
      const result = await pool.query<Product>(
        "SELECT * FROM Product WHERE category = $1",
        [category]
      );
      return res.json(result.rows);
    }
    const result = await pool.query<Product>("SELECT * FROM Product");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/v1/products/:id
router.get("/:product_id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Product>(
      "SELECT * FROM Product WHERE product_id = $1",
      [req.params.product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/v1/products
router.post("/", async (req: Request, res: Response) => {
  try {
    const { product_id, product_name, category, unit_price } = req.body;
    const result = await pool.query<Product>(
      `INSERT INTO Product (product_id, product_name, category, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, product_name, category ?? null, unit_price ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return res.status(400).json({ error: "Product already exists" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/v1/products/:id/price
router.patch("/:product_id/price", async (req: Request, res: Response) => {
  try {
    const { unit_price } = req.body;
    if (unit_price === undefined) {
      return res.status(400).json({ error: "unit_price is required" });
    }
    const result = await pool.query<Product>(
      `UPDATE Product SET unit_price = $2 WHERE product_id = $1 RETURNING *`,
      [req.params.product_id, unit_price]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
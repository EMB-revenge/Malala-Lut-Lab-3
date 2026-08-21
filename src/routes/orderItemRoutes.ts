import { Router, Request, Response } from "express";
import { pool } from "../db";
import { OrderItem } from "../types";

const router = Router();

// GET /api/v1/order-items/:orderId
router.get("/:orderId", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<OrderItem>(
      "SELECT * FROM Order_Item WHERE order_id = $1",
      [req.params.orderId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/v1/order-items
router.post("/", async (req: Request, res: Response) => {
  try {
    const { order_id, product_id, quantity, discount } = req.body;
    const result = await pool.query<OrderItem>(
      `INSERT INTO Order_Item (order_id, product_id, quantity, discount)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [order_id, product_id, quantity ?? null, discount ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return res.status(400).json({ error: "Order item already exists for this order/product" });
    }
    if (code === "23503") {
      return res.status(400).json({ error: "Order or product does not exist" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
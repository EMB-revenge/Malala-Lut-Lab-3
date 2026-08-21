import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Order } from "../types";

const router = Router();

// GET /api/v1/orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Order>("SELECT * FROM Orders");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/v1/orders/customer/:customerId
router.get("/customer/:customerId", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Order>(
      "SELECT * FROM Orders WHERE customer_id = $1",
      [req.params.customerId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/v1/orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const { order_id, customer_id, order_date, shipping_city } = req.body;
    const result = await pool.query<Order>(
      `INSERT INTO Orders (order_id, customer_id, order_date, shipping_city)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [order_id, customer_id, order_date ?? null, shipping_city ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return res.status(400).json({ error: "Order already exists" });
    }
    if (code === "23503") {
      return res.status(400).json({ error: "Customer does not exist" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/v1/orders/:id
router.delete("/:order_id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM Orders WHERE order_id = $1 RETURNING order_id",
      [req.params.order_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23503") {
      return res.status(400).json({ error: "Cannot delete order with existing order items" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
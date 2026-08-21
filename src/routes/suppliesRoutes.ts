import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Supply } from "../types";

const router = Router();

// GET /api/v1/supplies/vendor/:vendorId
// Description: Retrieves inventory stock entries maintained by a specific vendor.
// Success Response ( 200 OK ): Array of supply records.
router.get("/vendor/:vendorId", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Supply>(
      "SELECT * FROM Supplies WHERE vendor_id = $1",
      [req.params.vendorId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/v1/supplies/:vendorId/:productId
// Description: Updates the available stock quantity for a vendor's product supply.
// Success Response ( 200 OK ): Returns updated supply object.
// Error Response ( 404 Not Found ): If no supply record exists for that pair.
router.put("/:vendorId/:productId", async (req: Request, res: Response) => {
  try {
    const { stock_quantity } = req.body;
    if (stock_quantity === undefined) {
      return res.status(400).json({ error: "stock_quantity is required" });
    }
    // polish: reject non-numeric or negative stock before hitting the DB
    if (typeof stock_quantity !== "number" || stock_quantity < 0) {
      return res.status(400).json({ error: "stock_quantity must be a non-negative number" });
    }
    const result = await pool.query<Supply>(
      `UPDATE Supplies
       SET stock_quantity = $3
       WHERE vendor_id = $1 AND product_id = $2
       RETURNING *`,
      [req.params.vendorId, req.params.productId, stock_quantity]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supply record not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
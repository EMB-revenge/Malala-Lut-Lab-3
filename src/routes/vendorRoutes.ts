import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Vendor } from "../types";

const router = Router();

// GET /api/v1/vendors
// Description: Retrieves all vendor records.
// Success Response ( 200 OK ): Array of vendor objects.
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Vendor>("SELECT * FROM Vendor");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
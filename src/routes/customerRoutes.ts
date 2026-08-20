import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Customer } from "../types";


const router = Router();

//Description: Retrieves a list of all customers
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM CUSTOMER");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
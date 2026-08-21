import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Customer } from "../types";


const router = Router();

//Description: Retrieves a list of all customers
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM Customer");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/v1/customers 

router.post("/", async (req: Request, res: Response) => {
  try {
    const { customer_id, customer_name, city, membership_level } = req.body;
    const result = await pool.query<Customer>(
      `INSERT INTO Customer (customer_id, customer_name, city, membership_level)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customer_id, customer_name, city ?? null, membership_level ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return res.status(400).json({ error: "Customer already exists" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET api/customers/:id (api/customers/C101) 

router.get("/:customer_id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Customer>(
      "SELECT * FROM Customer WHERE customer_id = $1",
      [req.params.customer_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/v1/customers/:id

router.put("/:customer_id", async (req: Request, res: Response) => {
  try {
    const { city, membership_level } = req.body;
    if (city === undefined && membership_level === undefined) {
      return res.status(400).json({ error: "Provide city and/or membership_level" });
    }
    const result = await pool.query<Customer>(
      `UPDATE Customer
       SET city = COALESCE($2, city),
           membership_level = COALESCE($3, membership_level)
       WHERE customer_id = $1
       RETURNING *`,
      [req.params.customer_id, city ?? null, membership_level ?? null]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/v1/customers/:id

router.delete("/:customer_id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM Customer WHERE customer_id = $1 RETURNING customer_id",
      [req.params.customer_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23503") {
      return res.status(400).json({ error: "Cannot delete customer with existing orders" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

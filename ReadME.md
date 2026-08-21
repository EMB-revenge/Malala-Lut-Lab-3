# E-Commerce & Logistics Backend REST API — Lab 3

A Node.js/TypeScript backend built with Express and `pg` (node-postgres), implementing RESTful CRUD endpoints over a PostgreSQL database. No ORM or query builder is used — all queries are raw, parameterized SQL.

## Tech Stack

- Language: TypeScript
- Server: Express
- Database driver: node-postgres (`pg`)
- Database: PostgreSQL

## Prerequisites

- Node.js (v18 or later recommended)
- PostgreSQL installed and running locally (or accessible via a connection string)
- npm

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Using your PostgreSQL client of choice (DBeaver, psql, pgAdmin, etc.), create a new database and run the setup script provided in the lab handout. This creates and populates the following tables:

- `customer`
- `orders`
- `product`
- `order_item`
- `vendor`
- `supplies`

### 4. Configure environment variables

Create a `.env` file in the project root with the following variables, matching your local PostgreSQL setup:

```dotenv
PGUSER=your_pg_username
PGPASSWORD=your_pg_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=your_database_name
PORT=3000
```

> **Note:** these variable names must exactly match what `src/db.ts` expects (`PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT`). A mismatch here is the most common setup issue — the pool will silently fall back to defaults and every query will fail.

### 5. Run the server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or whichever `PORT` you set).

## Testing

Endpoints were tested manually using [Thunder Client](https://www.thunderclient.com/) (VS Code extension). All endpoints are prefixed with `/api/v1`.

Example request:

```
GET http://localhost:3000/api/v1/customers
```

## API Endpoints

### Customers (`/api/v1/customers`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all customers |
| GET | `/:id` | Get a single customer |
| POST | `/` | Create a customer |
| PUT | `/:id` | Update a customer's city/membership_level |
| DELETE | `/:id` | Delete a customer |

### Products (`/api/v1/products`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all products (optional `?category=` filter) |
| GET | `/:id` | Get a single product |
| POST | `/` | Create a product |
| PATCH | `/:id/price` | Update a product's price |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all orders |
| GET | `/customer/:customerId` | List orders for a specific customer |
| POST | `/` | Create an order |
| DELETE | `/:id` | Delete an order |

### Order Items (`/api/v1/order-items`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:orderId` | List line items for an order |
| POST | `/` | Add a line item to an order |

### Vendors & Supplies (`/api/v1/vendors`, `/api/v1/supplies`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/vendors` | List all vendors |
| GET | `/api/v1/supplies/vendor/:vendorId` | List stock entries for a vendor |
| PUT | `/api/v1/supplies/:vendorId/:productId` | Update stock quantity |

## Notes

- All SQL queries use parameterized values (`$1`, `$2`, ...) to prevent SQL injection.
- Route handlers use `try/catch` blocks and return appropriate HTTP status codes (`400`, `404`, `500`), including handling for foreign key and unique constraint violations from PostgreSQL.
- No multi-table JOINs are used, per the lab constraint — related data is fetched via sequential single-table queries where needed.

## Contributors

- Neil Nikko Marianno Lut
- Fletcher Jan Malala
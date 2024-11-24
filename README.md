# Bicycle Boulevard Server 🚲

A comprehensive backend API built with **Express** and **TypeScript**, designed for managing a bicycle store with MongoDB and Mongoose. This project supports CRUD operations for bicycles and orders, features advanced error handling, and ensures data integrity through schema validation. For Input validation `Zod` is used. Created a class `UnifiedError` with multiple private methods to process different types of errors.

---

## Features

### 🚴 Bicycle Management

- Create, read, update, and delete bicycles.
- Search for bicycles by name, brand, or type.
- Supports categories such as Mountain, Road, Hybrid, BMX, and Electric.

### 📦 Order Management

- Place orders with customer `email` and product (bicycle) `id`.
- Automatically adjust stock quantities and availability based on orders.
- Prevent orders if stock is insufficient.

### 📊 Revenue Insights

- Calculate total revenue from all orders using MongoDB aggregation.

### ⚙️ Error Handling

- Unified error responses for `validation` (mostly `zod` and `MongoDB`), `duplication`, `casting` (MongoDB `ObjectId`), and `parsing`, `insufficient`, `not found` and almost every possible types of errors.
- Clear and structured error messages to facilitate debugging.

---

## Run the Server Locally

### Prerequisites

- Node.js (v18+)
- pnpm package manager
- if you prefer `npm` or `yarn`, delete `pnpm-lock.yaml` file and follow the following steps

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nazmul-nhb/bicycle-boulevard-server.git
   cd bicycle-boulevard-server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

   for `npm`:

   ```bash
   npm install
   ```

   for `yarn`:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following fields:

   ```env
   PORT=4242
   MONGODB_URI=your_mongo_db_uri
   ```

4. Start the server:

   ```bash
   pnpm start
   ```

   for `npm`:

   ```bash
   npm start
   ```

   for `yarn`:

   ```bash
   yarn start
   ```

5. Access the API at:

   ```bash
   http://localhost:4242
   ```

---

## API Documentation

### Base URL

`http://localhost:4242`

### Endpoints

#### **Products (Bicycles)**

1. **Create a Bicycle**
   - **POST** `/api/products`
   - Request body:

     ```json
     {
       "name": "Roadster 5000",
       "brand": "SpeedX",
       "price": 300,
       "type": "Road",
       "description": "A premium road bike designed for speed and performance.",
       "quantity": 20,
       "inStock": true
     }
     ```

   - Response:

     ```json
     {
       "message": "Bicycle created successfully!",
       "success": true,
       "data": { ... }
     }
     ```

2. **Get All Bicycles**
   - **GET** `/api/products`
   - Query parameters: `searchTerm`
   - Response:

     ```json
     {
       "message": "Bicycles retrieved successfully!",
       "status": true,
       "data": [ ... ]
     }
     ```

3. **Get a Specific Bicycle**
   - **GET** `/api/products/:productId`

4. **Update a Bicycle**
   - **PUT** `/api/products/:productId`
   - Request body contains fields to update.

5. **Delete a Bicycle**
   - **DELETE** `/api/products/:productId`

#### **Orders**

1. **Place an Order**
   - **POST** `/api/orders`
   - Request body:

     ```json
     {
       "email": "customer@example.com",
       "product": "productId",
       "quantity": 2,
       "totalPrice": 600
     }
     ```

    `totalPrice` is optional, if not provided, the application will calculate total price from the product (bicycle) collection

2. **Get Revenue**
   - **GET** `/api/orders/revenue`
   - Response:

     ```json
     {
       "message": "Revenue calculated successfully!",
       "status": true,
       "data": { "totalRevenue": 1200 }
     }
     ```

---

## Error Responses

All error responses follow this structured format:

```json
{
  "message": "Error message",
  "success": false,
  "error": {
    "name": "ErrorName",
    "errors": { ... }
  },
  "stack": "Stack trace for the Error"
}
```

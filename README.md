# Bicycle Boulevard Server 🚲

- [Live Server](https://bicycle-boulevard-server-nhb.vercel.app)

A robust backend API built with `Express` and `TypeScript`, designed for managing bicycle inventory and orders with `MongoDB` and `Mongoose`. The server supports CRUD operations, advanced error handling, and comprehensive input validation powered by `Zod` and custom error processor.

## Key Highlights

- **Bicycle and Order Management:** Simplified endpoints for adding, updating, and searching bicycles, with order processing and revenue tracking.
- **Unified Error Handling:** Centralized handling for schema validation, database operations, and other potential failures using `UnifiedError` class.
- **Custom Error Instance:** Used a class `ErrorWithStatus` to create custom instance of `Error`.

---

## Features

### 🚴 Bicycle Management

- Create, read, update, and delete bicycles.
- Search for bicycles by `name`, `brand`, or `type`.
- Supports categories such as Mountain, Road, Hybrid, BMX, and Electric.

### 📦 Order Management

- Place orders with customer `email` and product (bicycle) `id`.
- Automatically adjust stock quantities and availability based on orders.
- Prevent orders if stock is insufficient.

### 📊 Revenue Insights

- Calculate total revenue from all orders using MongoDB aggregation.

### ⚙️ Error Handling

- Unified error responses for `validation` (mostly `zod` and `MongoDB`), `duplication`, `casting` (MongoDB `ObjectId`), `parsing`, `insufficient`, `not found` and almost every possible types of errors.
- Clear and structured error messages to facilitate debugging.

---

## Technologies (Packages) Used

- `TypeScript`
- `Node.js`
- `Express.js`
- `Mongoose`
- `cors`
- `dotenv`

## Run the Server Locally

### Prerequisites

- Node.js (v20+)
- `pnpm` package manager
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
   MONGO_URI=your_mongo_db_uri
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
        "data": {
            "name": "Roadster 5000",
            "brand": "SpeedX",
            "price": 300,
            "type": "Road",
            "description": "A premium road bike designed for speed and performance.",
            "quantity": 20,
            "inStock": true,
            "_id": "674339111fb2a11d437591ab",
            "createdAt": "2024-11-24T14:32:49.261Z",
            "updatedAt": "2024-11-24T14:32:49.261Z"
        }
    }
     ```

2. **Get All Bicycles**
   - **GET** `/api/products`
   - Query parameters: `searchTerm`
   - Query example: `/api/products?searchTerm=partialValueOfField` (`searchTerm` can be any partial value of `name`, `brand`, `type`)
   - Response:

    ```json
     {
       "message": "Bicycles retrieved successfully!",
       "status": true,
       "data": [ 
            {
                "_id": "6742c11a49c1956daec11abd",
                "name": "SpeedKing 500",
                "brand": "Velocity",
                "price": 1400,
                "type": "Road",
                "description": "Sleek road bike designed for speed enthusiasts.",
                "quantity": 10,
                "inStock": true,
                "createdAt": "2024-11-24T06:00:58.848Z",
                "updatedAt": "2024-11-24T14:17:00.495Z"
            },
            {
                "_id": "6742c12549c1956daec11abf",
                "name": "UrbanSprint",
                "brand": "CityCyclers",
                "price": 900,
                "type": "Road",
                "description": "Compact road bike perfect for urban commuting.",
                "quantity": 20,
                "inStock": true,
                "createdAt": "2024-11-24T06:01:09.382Z",
                "updatedAt": "2024-11-24T06:01:09.382Z"
            },
            {
                "_id": "6742c12d49c1956daec11ac1",
                "name": "Elite Strider",
                "brand": "SwiftRiders",
                "price": 1800,
                "type": "Road",
                "description": "Premium road bike for professional cyclists.",
                "quantity": 4,
                "inStock": true,
                "createdAt": "2024-11-24T06:01:17.674Z",
                "updatedAt": "2024-11-24T06:01:17.674Z"
            }
        ]
    }
     ```

3. **Get a Specific Bicycle**
   - **GET** `/api/products/:productId`
   - Response:

    ```json
    {
    "message": "Bicycle retrieved successfully!",
    "status": true,
    "data": {
            "_id": "6742c11a49c1956daec11abd",
            "name": "SpeedKing 500",
            "brand": "Velocity",
            "price": 1400,
            "type": "Road",
            "description": "Sleek road bike designed for speed enthusiasts.",
            "quantity": 12,
            "inStock": true,
            "createdAt": "2024-11-24T06:00:58.848Z",
            "updatedAt": "2024-11-24T06:00:58.848Z"
        }
    }
    ```

4. **Update a Bicycle**
   - **PUT** `/api/products/:productId`
   - Request body contains fields to update:

    ```json
     {
       "brand": "SpeedX",
       "price": 700,
       "type": "Mountain",
       "quantity": 12,
     }
     ```

   - Response:

    ```json
    {
        "message": "Bicycle deleted successfully!",
        "status": true,
        "data": {}
    }
    ```

5. **Delete a Bicycle**
   - **DELETE** `/api/products/:productId`

   - Response:

    ```json
    {
        "message": "Bicycle deleted successfully!",
        "status": true,
        "data": {}
    }
    ```

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

   - `totalPrice` is optional, if not provided, the application will calculate total price from the product (bicycle) collection

   - Response:

    ```json
    {
    "message": "Order created successfully!",
    "status": true,
    "data": {
            "email": "<abul@ab.vv>",
            "product": "6742c11a49c1956daec11abd",
            "quantity": 2,
            "_id": "6743355c1fb2a11d437591a4",
            "createdAt": "2024-11-24T14:17:00.399Z",
            "updatedAt": "2024-11-24T14:17:00.399Z",
            "totalPrice": 2800
        }
    }
    ```

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
  "stack": "Error: Something went wrong\n    at..."
}
```

- Example:

```json
{
 "message": "BSONError: Invalid ObjectId",
 "success": false,
 "error": {
  "name": "MongoDBCastError",
  "errors": {
   "_id": {
    "message": "Invalid ObjectId: 6742c11a49c1956daec11abdb",
    "name": "CastError",
    "properties": {
     "message": "Invalid ObjectId: 6742c11a49c1956daec11abdb",
     "type": "ObjectId"
    },
    "kind": "ObjectId",
    "path": "_id",
    "value": "6742c11a49c1956daec11abdb"
   }
  }
 },
 "stack": "Error: Something went wrong\n    at path \"_id\" for model \"Product\"\n\n    at SchemaObjectId.cast..."
 }
```

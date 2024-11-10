# Run localy

## Requirements

- Node.js
- PostgreSQL

## Setup

### 1. Install Dependencies

First, install the necessary dependencies by running:

```bash
npm install
```

### 2. Create Database

```sql
CREATE DATABASE car_parts_inventory_db;
```

### 3. Configure Environment Variables

Create .env at the root of the project

- Provide port
- Database url
- And your admin pass

## Make sure you change this with your information

```env
PORT=3000
DB_CONNECTION_STRING = postgres://username:password@localhost:5432/car_parts_inventory_db
ADMIN_PASSWORD=ADMIN
```

### 4. Populate the database with the script provided

```bash
node db/populatedb.js postgres://username:password@localhost:5432/car_parts_inventory_db
```

### 5. Run application

```bash
npm run dev
```

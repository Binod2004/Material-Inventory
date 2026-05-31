# Material Inventory Management System

A full-stack inventory management application for Vizag Steel Plant.

<<<<<<< HEAD
Features
- Admin panel and inventory modules: materials, suppliers, stock levels
- REST API backend: Node.js + Express
- Frontend: static HTML, CSS, and vanilla JavaScript
- MySQL database with schema and seed data

Directory structure
- backend/ — Node.js API that also serves the static frontend
- frontend/ — plain HTML/CSS/JavaScript user interface
- db/ — SQL schema and seeds

Quick start
1. Install MySQL and create a database `vizag_inventory`.
2. Import schema: `db/schema.sql`.
3. Configure environment: copy `backend/.env.example` → `backend/.env` and set DB credentials.
4. Start backend and frontend together:
   - cd `backend`
   - `npm install`
   - `npm start`
5. Open `http://localhost:4000` in your browser.

API endpoints
- GET /api/materials
- POST /api/materials
- GET /api/suppliers
- POST /api/suppliers
- GET /api/stock
- POST /api/stock

Frontend features
- Dashboard showing materials, suppliers, and stock data
- Admin console for adding materials, suppliers, and stock entries
- Responsive UI built with pure HTML, CSS, and JavaScript

See `backend/server.js` for API details and `frontend/index.html` for the user interface.
=======
## Tech Stack
- Frontend: React, React Router, Axios, Vite
- Backend: Node.js, Express, MySQL
- Database: MySQL

## Features
- Admin login and authentication flow
- Dashboard with summary cards
- Materials management with CRUD, search, filter
- Supplier management with CRUD
- Stock level tracking and low-stock alerts
- Inventory reports for low-stock items
- Responsive sidebar navigation, header, footer, alerts
- REST API with layered Node.js architecture
- Validation, exception handling, CORS config

## Project Structure
- `backend/` — Node.js backend source code
- `frontend/` — React frontend application
- `db/` — MySQL schema and sample data
- `README.md` — project setup and usage

## Setup Instructions

### 1. Prepare MySQL
1. Install MySQL server.
2. Create the database and tables:
```bash
mysql -u root -p < "c:/Users/user/Material Inventory/db/schema.sql"
```
3. Update `backend/.env.example` and copy to `backend/.env` with your DB credentials.

### 2. Run backend
```bash
cd "c:/Users/user/Material Inventory/backend"
npm install
npm start
```
Backend runs on `http://localhost:4000`.

### 3. Run frontend
```bash
cd "c:/Users/user/Material Inventory/frontend"
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 4. Login
- Username: `admin`
- Password: `admin123`

## Backend API Endpoints
- `POST /api/auth/login` — admin login
- `GET /api/dashboard` — dashboard metrics
- `GET /api/materials` — list materials
- `POST /api/materials` — add material
- `PUT /api/materials/{id}` — update material
- `DELETE /api/materials/{id}` — delete material
- `GET /api/suppliers` — list suppliers
- `POST /api/suppliers` — add supplier
- `PUT /api/suppliers/{id}` — update supplier
- `DELETE /api/suppliers/{id}` — delete supplier
- `GET /api/stock` — list stock levels
- `GET /api/stock/low` — low stock reports
- `POST /api/stock` — add stock record
- `PUT /api/stock/{id}` — update stock
- `DELETE /api/stock/{id}` — delete stock

## Notes
- The React app stores a simple auth flag in `localStorage`.
- The backend uses Express, MySQL, and validation middleware.
- `db/schema.sql` contains the database schema plus sample admin, suppliers, materials, and stock.

## Recommended Improvements
- Add real authentication tokens (JWT)
- Add password hashing for admin login and user registration
- Add pagination and sorting for tables
- Add reporting export and analytics
>>>>>>> 2cbe4a49f854f45ef57c783bbfcc2611d419a530

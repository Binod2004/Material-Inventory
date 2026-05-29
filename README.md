# Vizag Steel Plant — Material Inventory Management

A scaffolded inventory management system tailored for Vizag Steel Plant.

Features
- Admin panel and inventory modules: materials, suppliers, stock levels
- REST API backend: Node.js + Express
- Frontend: React (Vite)
- MySQL database with schema and seed data

Directory structure
- backend/ — Node.js API
- frontend/ — React app (Vite)
- db/ — SQL schema and seeds

Quick start
1. Install MySQL and create a database `vizag_inventory`.
2. Import schema: `db/schema.sql`.
3. Configure environment: copy `backend/.env.example` → `backend/.env` and set DB credentials.
4. Start backend:
   - cd `backend`
   - `npm install`
   - `npm run dev` (requires `nodemon`) or `npm start`
5. Start frontend:
   - cd `frontend`
   - `npm install`
   - `npm run dev`

API endpoints (examples)
- GET /api/materials
- POST /api/materials
- GET /api/suppliers
- POST /api/suppliers
- GET /api/stock
- POST /api/stock

Frontend features
- Dashboard view for materials, suppliers, and stock
- Admin page for adding materials, suppliers, and stock levels

See the `backend` and `frontend` folders for implementation details and further instructions.

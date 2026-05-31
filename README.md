# Vizag Steel Plant — Material Inventory Management

A scaffolded inventory management system tailored for Vizag Steel Plant.

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

# Material Inventory Management System

A full-stack inventory management application for Vizag Steel Plant.

## Features
- Admin panel and inventory modules: materials, suppliers, stock levels
- REST API backend: Node.js + Express
- Frontend: static HTML, CSS, and vanilla JavaScript
- MySQL database with schema and seed data

## Directory structure
- `backend/` — Node.js API that also serves the static frontend
- `frontend/` — plain HTML/CSS/JavaScript single-page user interface
- `frontend-static/` — multi-page static HTML/CSS/JavaScript user interface (deployed to Vercel)
- `db/` — SQL schema and seeds

## Quick start
1. Install MySQL and create a database `vizag_inventory`.
2. Import schema: `db/schema.sql`.
3. Configure environment: copy `backend/.env.example` → `backend/.env` and set DB credentials.
4. Start backend and frontend together:
   - cd `backend`
   - `npm install`
   - `npm start`
5. Open `http://localhost:4000` in your browser.

## API endpoints
- GET /api/materials
- POST /api/materials
- GET /api/suppliers
- POST /api/suppliers
- GET /api/stock
- POST /api/stock

## Vercel Deployment
This project is configured to run on Vercel:
- The static frontend (`frontend-static`) is deployed as the client.
- The Express API is mapped via rewrites to a Vercel Serverless Function under `api/index.js` which loads the backend.
- Page URLs are automatically cleaned (e.g., `/materials` instead of `/materials.html`) via Vercel's `cleanUrls` setting.

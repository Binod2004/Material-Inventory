require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./src/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Materials
app.get('/api/materials', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM materials');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/materials', async (req, res) => {
  try {
    const { code, name, unit, min_level } = req.body;
    const [result] = await db.query('INSERT INTO materials (code,name,unit,min_level) VALUES (?,?,?,?)', [code,name,unit,min_level||0]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, contact } = req.body;
    const [result] = await db.query('INSERT INTO suppliers (name,contact) VALUES (?,?)', [name,contact]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stock
app.get('/api/stock', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.id, m.code as material_code, m.name as material_name, su.name as supplier_name, s.quantity, s.min_level
       FROM stock_levels s
       JOIN materials m ON s.material_id = m.id
       LEFT JOIN suppliers su ON s.supplier_id = su.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stock', async (req, res) => {
  try {
    const { material_id, supplier_id, quantity, min_level } = req.body;
    const [result] = await db.query(
      'INSERT INTO stock_levels (material_id,supplier_id,quantity,min_level) VALUES (?,?,?,?)',
      [material_id,supplier_id,quantity,min_level||0]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

-- Schema for Vizag Steel Plant inventory
CREATE DATABASE IF NOT EXISTS vizag_inventory;
USE vizag_inventory;

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50),
  min_level INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  supplier_id INT,
  quantity INT DEFAULT 0,
  min_level INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Seed sample data
INSERT INTO suppliers (name,contact) VALUES ('Steel Supplies Pvt Ltd','+91-891-0000000') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO materials (code,name,unit,min_level) VALUES ('MS001','Mild Steel Plate','kg',1000) ON DUPLICATE KEY UPDATE name=name;

-- Insert a stock record if not exists
INSERT INTO stock_levels (material_id,supplier_id,quantity,min_level)
SELECT m.id, s.id, 5000, m.min_level FROM materials m JOIN suppliers s LIMIT 1;

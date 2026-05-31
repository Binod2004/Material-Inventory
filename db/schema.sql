-- Schema for Vizag Steel Plant inventory
CREATE DATABASE IF NOT EXISTS vizag_inventory;
USE vizag_inventory;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  email VARCHAR(255),
  address VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS materials (
  material_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  material_name VARCHAR(255) NOT NULL,
  category VARCHAR(150),
  quantity INT DEFAULT 0,
  unit_price DECIMAL(12,2) DEFAULT 0,
  supplier_id BIGINT,
  stock_status VARCHAR(100),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

CREATE TABLE IF NOT EXISTS stock_levels (
  stock_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  material_id BIGINT NOT NULL,
  available_stock INT DEFAULT 0,
  minimum_stock INT DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO admins (username,password) VALUES ('admin','admin123')
  ON DUPLICATE KEY UPDATE password = password;

INSERT INTO suppliers (supplier_name,phone,email,address) VALUES
('Steel Supply Co.','+91-891-1234567','sales@steelsupply.com','Vizag Industrial Area')
ON DUPLICATE KEY UPDATE phone=phone;

INSERT INTO materials (material_name,category,quantity,unit_price,supplier_id,stock_status) VALUES
('Mild Steel Plate','Raw Material',150,42.50,1,'In stock'),
('Alloy Bar','Finished Stock',30,95.00,1,'Low stock')
ON DUPLICATE KEY UPDATE material_name=material_name;

INSERT INTO stock_levels (material_id,available_stock,minimum_stock,last_updated) VALUES
(1,150,50,NOW()),
(2,30,50,NOW())
ON DUPLICATE KEY UPDATE available_stock=available_stock;

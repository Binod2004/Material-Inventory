const state = {
  admins: [
    { id: 1, username: 'admin', password: 'admin123' }
  ],
  suppliers: [
    { supplier_id: 1, supplier_name: 'Steel Supply Co.', phone: '+91-891-1234567', email: 'sales@steelsupply.com', address: 'Vizag Industrial Area' }
  ],
  materials: [
    { material_id: 1, material_name: 'Mild Steel Plate', category: 'Raw Material', quantity: 150, unit_price: 42.50, supplier_id: 1, stock_status: 'In stock' },
    { material_id: 2, material_name: 'Alloy Bar', category: 'Finished Stock', quantity: 30, unit_price: 95.00, supplier_id: 1, stock_status: 'Low stock' }
  ],
  stock_levels: [
    { stock_id: 1, material_id: 1, available_stock: 150, minimum_stock: 50, last_updated: new Date().toISOString() },
    { stock_id: 2, material_id: 2, available_stock: 30, minimum_stock: 50, last_updated: new Date().toISOString() }
  ],
  nextIds: {
    admin: 2,
    supplier: 2,
    material: 3,
    stock: 3
  }
};

function cloneRow(row) {
  return JSON.parse(JSON.stringify(row));
}

function findSupplierById(id) {
  return state.suppliers.find((supplier) => supplier.supplier_id === id) || null;
}

function getMaterialRow(material) {
  return {
    material_id: material.material_id,
    material_name: material.material_name,
    category: material.category,
    quantity: material.quantity,
    unit_price: material.unit_price,
    stock_status: material.stock_status,
    supplier_id: material.supplier_id
  };
}

function query(sql, params = []) {
  sql = sql.trim().replace(/\s+/g, ' ').toUpperCase();
  const lowerSql = sql.toLowerCase();

  if (lowerSql.startsWith('select * from admins where username =')) {
    const username = params[0];
    const row = state.admins.find((admin) => admin.username === username);
    return [row ? [cloneRow(row)] : []];
  }

  if (lowerSql.startsWith('update admins set password =')) {
    const [password, id] = params;
    const admin = state.admins.find((item) => item.id === Number(id));
    if (admin) admin.password = password;
    return [{ affectedRows: admin ? 1 : 0 }];
  }

  if (lowerSql.startsWith('select * from suppliers order by supplier_name')) {
    return [state.suppliers.map(cloneRow).sort((a, b) => a.supplier_name.localeCompare(b.supplier_name))];
  }
  if (lowerSql.startsWith('select * from suppliers where supplier_id =')) {
    const supplier = state.suppliers.find((item) => item.supplier_id === Number(params[0]));
    return [supplier ? [cloneRow(supplier)] : []];
  }
  if (lowerSql.startsWith('insert into suppliers')) {
    const [supplierName, phone, email, address] = params;
    const supplier = {
      supplier_id: state.nextIds.supplier++,
      supplier_name: supplierName,
      phone,
      email,
      address
    };
    state.suppliers.push(supplier);
    return [{ insertId: supplier.supplier_id }];
  }
  if (lowerSql.startsWith('update suppliers set supplier_name')) {
    const [supplierName, phone, email, address, id] = params;
    const supplier = state.suppliers.find((item) => item.supplier_id === Number(id));
    if (supplier) {
      supplier.supplier_name = supplierName;
      supplier.phone = phone;
      supplier.email = email;
      supplier.address = address;
    }
    return [{ affectedRows: supplier ? 1 : 0 }];
  }
  if (lowerSql.startsWith('delete from suppliers where supplier_id =')) {
    const id = Number(params[0]);
    const index = state.suppliers.findIndex((item) => item.supplier_id === id);
    if (index !== -1) state.suppliers.splice(index, 1);
    return [{ affectedRows: index !== -1 ? 1 : 0 }];
  }

  if (lowerSql.startsWith('select m.material_id')) {
    const rows = state.materials.map((row) => {
      const supplier = findSupplierById(row.supplier_id);
      return {
        material_id: row.material_id,
        material_name: row.material_name,
        category: row.category,
        quantity: row.quantity,
        unit_price: row.unit_price,
        stock_status: row.stock_status,
        supplier_id: supplier?.supplier_id || null,
        supplier_name: supplier?.supplier_name || null
      };
    });
    return [rows.sort((a, b) => a.material_name.localeCompare(b.material_name))];
  }
  if (lowerSql.startsWith('select * from materials where material_id =')) {
    const row = state.materials.find((item) => item.material_id === Number(params[0]));
    return [row ? [cloneRow(row)] : []];
  }
  if (lowerSql.startsWith('insert into materials')) {
    const [name, category, quantity, unitPrice, supplierId, stockStatus] = params;
    const material = {
      material_id: state.nextIds.material++,
      material_name: name,
      category,
      quantity,
      unit_price: unitPrice,
      supplier_id: supplierId || null,
      stock_status: stockStatus
    };
    state.materials.push(material);
    return [{ insertId: material.material_id }];
  }
  if (lowerSql.startsWith('update materials set material_name =')) {
    const [name, category, quantity, unitPrice, supplierId, stockStatus, id] = params;
    const material = state.materials.find((item) => item.material_id === Number(id));
    if (material) {
      material.material_name = name;
      material.category = category;
      material.quantity = quantity;
      material.unit_price = unitPrice;
      material.supplier_id = supplierId || null;
      material.stock_status = stockStatus;
    }
    return [{ affectedRows: material ? 1 : 0 }];
  }
  if (lowerSql.startsWith('delete from materials where material_id =')) {
    const id = Number(params[0]);
    const index = state.materials.findIndex((item) => item.material_id === id);
    if (index !== -1) state.materials.splice(index, 1);
    return [{ affectedRows: index !== -1 ? 1 : 0 }];
  }

  if (lowerSql.startsWith('select sl.stock_id')) {
    const rows = state.stock_levels.map((row) => {
      const material = state.materials.find((item) => item.material_id === row.material_id) || {};
      const supplier = findSupplierById(material.supplier_id);
      return {
        stock_id: row.stock_id,
        available_stock: row.available_stock,
        minimum_stock: row.minimum_stock,
        last_updated: row.last_updated,
        material_id: material.material_id || null,
        material_name: material.material_name || null,
        category: material.category || null,
        supplier_id: supplier?.supplier_id || null,
        supplier_name: supplier?.supplier_name || null
      };
    });
    return [rows.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))];
  }
  if (lowerSql.startsWith('select sl.stock_id, sl.available_stock, sl.minimum_stock, sl.last_updated') && lowerSql.includes('where sl.available_stock < sl.minimum_stock')) {
    const rows = state.stock_levels.filter((row) => row.available_stock < row.minimum_stock).map((row) => {
      const material = state.materials.find((item) => item.material_id === row.material_id) || {};
      const supplier = findSupplierById(material.supplier_id);
      return {
        stock_id: row.stock_id,
        available_stock: row.available_stock,
        minimum_stock: row.minimum_stock,
        last_updated: row.last_updated,
        material_id: material.material_id || null,
        material_name: material.material_name || null,
        category: material.category || null,
        supplier_id: supplier?.supplier_id || null,
        supplier_name: supplier?.supplier_name || null
      };
    });
    return [rows.sort((a, b) => a.available_stock - b.available_stock)];
  }
  if (lowerSql.startsWith('select * from stock_levels where stock_id =')) {
    const row = state.stock_levels.find((item) => item.stock_id === Number(params[0]));
    return [row ? [cloneRow(row)] : []];
  }
  if (lowerSql.startsWith('insert into stock_levels')) {
    const [materialId, availableStock, minimumStock] = params;
    const stock = {
      stock_id: state.nextIds.stock++,
      material_id: materialId,
      available_stock: availableStock,
      minimum_stock: minimumStock,
      last_updated: new Date().toISOString()
    };
    state.stock_levels.push(stock);
    return [{ insertId: stock.stock_id }];
  }
  if (lowerSql.startsWith('update stock_levels set available_stock =')) {
    const [availableStock, minimumStock, id] = params;
    const stock = state.stock_levels.find((item) => item.stock_id === Number(id));
    if (stock) {
      stock.available_stock = availableStock;
      stock.minimum_stock = minimumStock;
      stock.last_updated = new Date().toISOString();
    }
    return [{ affectedRows: stock ? 1 : 0 }];
  }
  if (lowerSql.startsWith('delete from stock_levels where stock_id =')) {
    const id = Number(params[0]);
    const index = state.stock_levels.findIndex((item) => item.stock_id === id);
    if (index !== -1) state.stock_levels.splice(index, 1);
    return [{ affectedRows: index !== -1 ? 1 : 0 }];
  }
  if (lowerSql.startsWith('update materials set quantity =')) {
    const [quantity, stockStatus, materialId] = params;
    const material = state.materials.find((item) => item.material_id === Number(materialId));
    if (material) {
      material.quantity = quantity;
      material.stock_status = stockStatus;
    }
    return [{ affectedRows: material ? 1 : 0 }];
  }

  throw new Error(`Fallback DB cannot handle SQL: ${sql}`);
}

module.exports = { query, state };

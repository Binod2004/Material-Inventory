const state = {
  materials: [
    { id: 1, code: 'MSP-001', name: 'Mild Steel Plate', unit: 'kg', min_level: 50 },
    { id: 2, code: 'ALB-002', name: 'Alloy Bar', unit: 'kg', min_level: 40 }
  ],
  suppliers: [
    { id: 1, name: 'Steel Supply Co.', contact: '+91-891-1234567' }
  ],
  stock: [
    { id: 1, material_id: 1, supplier_id: 1, quantity: 150, min_level: 50 },
    { id: 2, material_id: 2, supplier_id: 1, quantity: 30, min_level: 40 }
  ],
  nextIds: {
    material: 3,
    supplier: 2,
    stock: 3
  }
};

function json(res, status, body) {
  res.status(status).json(body);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getStockRows() {
  return state.stock.map((entry) => {
    const material = state.materials.find((m) => m.id === entry.material_id) || null;
    const supplier = state.suppliers.find((s) => s.id === entry.supplier_id) || null;

    return {
      id: entry.id,
      material_id: entry.material_id,
      supplier_id: entry.supplier_id,
      quantity: entry.quantity,
      min_level: entry.min_level,
      material_code: material?.code || 'UNKNOWN',
      material_name: material?.name || 'Unknown material',
      supplier_name: supplier?.name || null
    };
  });
}

module.exports = (req, res) => {
  const method = req.method || 'GET';
  const url = req.url || '/';

  if (method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    return res.status(204).end();
  }

  if (method === 'GET' && url === '/api/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (method === 'GET' && url === '/api/materials') {
    return json(res, 200, state.materials);
  }

  if (method === 'POST' && url === '/api/materials') {
    const body = parseBody(req);
    if (!body.code || !body.name) {
      return json(res, 400, { error: 'Material code and name are required' });
    }

    const material = {
      id: state.nextIds.material++,
      code: String(body.code).trim(),
      name: String(body.name).trim(),
      unit: body.unit ? String(body.unit).trim() : '',
      min_level: Number(body.min_level || 0)
    };

    state.materials.push(material);
    return json(res, 201, material);
  }

  if (method === 'GET' && url === '/api/suppliers') {
    return json(res, 200, state.suppliers);
  }

  if (method === 'POST' && url === '/api/suppliers') {
    const body = parseBody(req);
    if (!body.name) {
      return json(res, 400, { error: 'Supplier name is required' });
    }

    const supplier = {
      id: state.nextIds.supplier++,
      name: String(body.name).trim(),
      contact: body.contact ? String(body.contact).trim() : ''
    };

    state.suppliers.push(supplier);
    return json(res, 201, supplier);
  }

  if (method === 'GET' && url === '/api/stock') {
    return json(res, 200, getStockRows());
  }

  if (method === 'POST' && url === '/api/stock') {
    const body = parseBody(req);
    const materialId = Number(body.material_id);
    if (!materialId || Number.isNaN(materialId)) {
      return json(res, 400, { error: 'Valid material_id is required' });
    }

    const material = state.materials.find((m) => m.id === materialId);
    if (!material) {
      return json(res, 404, { error: 'Material not found' });
    }

    const supplierId = body.supplier_id ? Number(body.supplier_id) : null;
    if (supplierId && !state.suppliers.find((s) => s.id === supplierId)) {
      return json(res, 404, { error: 'Supplier not found' });
    }

    const stock = {
      id: state.nextIds.stock++,
      material_id: materialId,
      supplier_id: supplierId,
      quantity: Number(body.quantity || 0),
      min_level: Number(body.min_level || 0)
    };

    state.stock.push(stock);
    return json(res, 201, stock);
  }

  return json(res, 404, { error: 'Not found' });
};

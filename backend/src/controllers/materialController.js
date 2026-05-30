const materialService = require('../services/materialService');

exports.getAll = async (req, res, next) => {
  try {
    const materials = await materialService.getAllMaterials();
    res.json(materials);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const material = await materialService.getMaterialById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = {
      materialName: req.body.materialName,
      category: req.body.category || '',
      quantity: Number(req.body.quantity),
      unitPrice: Number(req.body.unitPrice),
      supplierId: req.body.supplier?.supplierId || req.body.supplierId || null,
      stockStatus: req.body.stockStatus || 'In stock'
    };
    const created = await materialService.createMaterial(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const payload = {
      materialName: req.body.materialName,
      category: req.body.category || '',
      quantity: Number(req.body.quantity),
      unitPrice: Number(req.body.unitPrice),
      supplierId: req.body.supplier?.supplierId || req.body.supplierId || null,
      stockStatus: req.body.stockStatus || 'In stock'
    };
    const updated = await materialService.updateMaterial(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await materialService.deleteMaterial(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

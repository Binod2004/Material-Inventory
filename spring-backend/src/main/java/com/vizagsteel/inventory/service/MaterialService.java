package com.vizagsteel.inventory.service;

import com.vizagsteel.inventory.entity.Material;
import com.vizagsteel.inventory.entity.Supplier;
import com.vizagsteel.inventory.repository.MaterialRepository;
import com.vizagsteel.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final SupplierRepository supplierRepository;

    public MaterialService(MaterialRepository materialRepository, SupplierRepository supplierRepository) {
        this.materialRepository = materialRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Material saveMaterial(Material material, Long supplierId) {
        if (supplierId != null) {
            Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
            material.setSupplier(supplier);
        }
        material.setStockStatus(computeStockStatus(material.getQuantity(), material.getStockStatus()));
        return materialRepository.save(material);
    }

    public Material getMaterialById(Long id) {
        return materialRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Material not found"));
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    private String computeStockStatus(Integer quantity, String currentStatus) {
        if (quantity == null) {
            return currentStatus;
        }
        if (quantity <= 0) {
            return "Out of stock";
        }
        if (quantity < 10) {
            return "Low stock";
        }
        return "In stock";
    }
}

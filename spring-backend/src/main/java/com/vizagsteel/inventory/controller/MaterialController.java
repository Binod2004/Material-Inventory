package com.vizagsteel.inventory.controller;

import com.vizagsteel.inventory.entity.Material;
import com.vizagsteel.inventory.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    @GetMapping("/{id}")
    public Material getMaterial(@PathVariable Long id) {
        return materialService.getMaterialById(id);
    }

    @PostMapping
    public Material createMaterial(@Valid @RequestBody Material material) {
        Long supplierId = material.getSupplier() != null ? material.getSupplier().getSupplierId() : null;
        return materialService.saveMaterial(material, supplierId);
    }

    @PutMapping("/{id}")
    public Material updateMaterial(@PathVariable Long id, @Valid @RequestBody Material material) {
        Material existing = materialService.getMaterialById(id);
        existing.setMaterialName(material.getMaterialName());
        existing.setCategory(material.getCategory());
        existing.setQuantity(material.getQuantity());
        existing.setUnitPrice(material.getUnitPrice());
        if (material.getSupplier() != null) {
            existing.setSupplier(material.getSupplier());
        }
        existing.setStockStatus(material.getStockStatus());
        return materialService.saveMaterial(existing, existing.getSupplier() != null ? existing.getSupplier().getSupplierId() : null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}

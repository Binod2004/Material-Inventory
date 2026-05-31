package com.vizagsteel.inventory.service;

import com.vizagsteel.inventory.entity.Material;
import com.vizagsteel.inventory.entity.StockLevel;
import com.vizagsteel.inventory.repository.MaterialRepository;
import com.vizagsteel.inventory.repository.StockLevelRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockLevelService {

    private final StockLevelRepository stockLevelRepository;
    private final MaterialRepository materialRepository;

    public StockLevelService(StockLevelRepository stockLevelRepository, MaterialRepository materialRepository) {
        this.stockLevelRepository = stockLevelRepository;
        this.materialRepository = materialRepository;
    }

    public List<StockLevel> getAllStockLevels() {
        return stockLevelRepository.findAll();
    }

    public StockLevel saveStockLevel(StockLevel stockLevel, Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));
        stockLevel.setMaterial(material);
        stockLevel.setLastUpdated(LocalDateTime.now());
        int available = stockLevel.getAvailableStock() != null ? stockLevel.getAvailableStock() : 0;
        material.setQuantity(available);
        material.setStockStatus(available < stockLevel.getMinimumStock() ? "Low stock" : "In stock");
        materialRepository.save(material);
        return stockLevelRepository.save(stockLevel);
    }

    public StockLevel getStockLevelById(Long id) {
        return stockLevelRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Stock record not found"));
    }

    public void deleteStockLevel(Long id) {
        stockLevelRepository.deleteById(id);
    }

    public List<StockLevel> getLowStockItems(Integer threshold) {
        return stockLevelRepository.findByAvailableStockLessThan(threshold);
    }
}

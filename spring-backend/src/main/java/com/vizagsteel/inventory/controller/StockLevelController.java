package com.vizagsteel.inventory.controller;

import com.vizagsteel.inventory.entity.StockLevel;
import com.vizagsteel.inventory.service.StockLevelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockLevelController {

    private final StockLevelService stockLevelService;

    public StockLevelController(StockLevelService stockLevelService) {
        this.stockLevelService = stockLevelService;
    }

    @GetMapping
    public List<StockLevel> getAllStockLevels() {
        return stockLevelService.getAllStockLevels();
    }

    @GetMapping("/low")
    public List<StockLevel> getLowStockItems(@RequestParam(required = false, defaultValue = "10") Integer threshold) {
        return stockLevelService.getLowStockItems(threshold);
    }

    @PostMapping
    public StockLevel createStock(@Valid @RequestBody StockLevel stockLevel) {
        if (stockLevel.getMaterial() == null || stockLevel.getMaterial().getMaterialId() == null) {
            throw new IllegalArgumentException("Material id must be provided");
        }
        return stockLevelService.saveStockLevel(stockLevel, stockLevel.getMaterial().getMaterialId());
    }

    @PutMapping("/{id}")
    public StockLevel updateStock(@PathVariable Long id, @Valid @RequestBody StockLevel stockLevel) {
        StockLevel existing = stockLevelService.getStockLevelById(id);
        existing.setAvailableStock(stockLevel.getAvailableStock());
        existing.setMinimumStock(stockLevel.getMinimumStock());
        existing.setLastUpdated(java.time.LocalDateTime.now());
        return stockLevelService.saveStockLevel(existing, existing.getMaterial().getMaterialId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockLevelService.deleteStockLevel(id);
        return ResponseEntity.noContent().build();
    }
}

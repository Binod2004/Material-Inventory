package com.vizagsteel.inventory.controller;

import com.vizagsteel.inventory.repository.MaterialRepository;
import com.vizagsteel.inventory.repository.SupplierRepository;
import com.vizagsteel.inventory.repository.StockLevelRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final MaterialRepository materialRepository;
    private final SupplierRepository supplierRepository;
    private final StockLevelRepository stockLevelRepository;

    public DashboardController(MaterialRepository materialRepository, SupplierRepository supplierRepository, StockLevelRepository stockLevelRepository) {
        this.materialRepository = materialRepository;
        this.supplierRepository = supplierRepository;
        this.stockLevelRepository = stockLevelRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalMaterials", materialRepository.count());
        metrics.put("totalSuppliers", supplierRepository.count());
        metrics.put("totalStockRecords", stockLevelRepository.count());
        metrics.put("lowStockItems", stockLevelRepository.findByAvailableStockLessThan(10).size());
        metrics.put("availableStock", stockLevelRepository.findAll().stream().mapToInt(r -> r.getAvailableStock() != null ? r.getAvailableStock() : 0).sum());
        return metrics;
    }
}

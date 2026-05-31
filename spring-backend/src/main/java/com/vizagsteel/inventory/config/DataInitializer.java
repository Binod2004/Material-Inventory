package com.vizagsteel.inventory.config;

import com.vizagsteel.inventory.entity.Admin;
import com.vizagsteel.inventory.entity.Material;
import com.vizagsteel.inventory.entity.StockLevel;
import com.vizagsteel.inventory.entity.Supplier;
import com.vizagsteel.inventory.repository.AdminRepository;
import com.vizagsteel.inventory.repository.MaterialRepository;
import com.vizagsteel.inventory.repository.StockLevelRepository;
import com.vizagsteel.inventory.repository.SupplierRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final AdminRepository adminRepository;
    private final SupplierRepository supplierRepository;
    private final MaterialRepository materialRepository;
    private final StockLevelRepository stockLevelRepository;

    public DataInitializer(AdminRepository adminRepository, SupplierRepository supplierRepository,
                           MaterialRepository materialRepository, StockLevelRepository stockLevelRepository) {
        this.adminRepository = adminRepository;
        this.supplierRepository = supplierRepository;
        this.materialRepository = materialRepository;
        this.stockLevelRepository = stockLevelRepository;
    }

    @PostConstruct
    public void seedData() {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin("admin", "admin123"));
        }

        if (supplierRepository.count() == 0) {
            Supplier supplier = supplierRepository.save(new Supplier("Steel Supply Co.", "+91-891-1234567", "sales@steelsupply.com", "Vizag Industrial Area"));
            Material plate = materialRepository.save(new Material("Mild Steel Plate", "Raw Material", 150, 42.5, supplier, "In stock"));
            materialRepository.save(new Material("Alloy Bar", "Finished Stock", 30, 95.0, supplier, "Low stock"));
            stockLevelRepository.save(new StockLevel(plate, 150, 50));
        }
    }
}

package com.vizagsteel.inventory.repository;

import com.vizagsteel.inventory.entity.StockLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockLevelRepository extends JpaRepository<StockLevel, Long> {
    List<StockLevel> findByAvailableStockLessThan(Integer minimumStock);
}

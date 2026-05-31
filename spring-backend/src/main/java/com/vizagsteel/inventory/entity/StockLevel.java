package com.vizagsteel.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_levels")
public class StockLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @Min(0)
    private Integer availableStock;

    @Min(0)
    private Integer minimumStock;

    private LocalDateTime lastUpdated;

    public StockLevel() {}

    public StockLevel(Material material, Integer availableStock, Integer minimumStock) {
        this.material = material;
        this.availableStock = availableStock;
        this.minimumStock = minimumStock;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getStockId() {
        return stockId;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(Integer minimumStock) {
        this.minimumStock = minimumStock;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}

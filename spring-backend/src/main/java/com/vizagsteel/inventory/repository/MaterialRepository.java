package com.vizagsteel.inventory.repository;

import com.vizagsteel.inventory.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
}

package com.vizagsteel.inventory.controller;

import com.vizagsteel.inventory.dto.ApiResponse;
import com.vizagsteel.inventory.dto.LoginRequest;
import com.vizagsteel.inventory.entity.Admin;
import com.vizagsteel.inventory.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;

    public AuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        Admin admin = adminService.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!admin.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return ResponseEntity.ok(new ApiResponse(true, "Login successful"));
    }
}

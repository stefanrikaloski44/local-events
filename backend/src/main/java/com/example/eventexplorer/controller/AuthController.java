package com.example.eventexplorer.controller;

import com.example.eventexplorer.dto.RegisterRequest;
import com.example.eventexplorer.model.User;
import com.example.eventexplorer.model.Role;
import com.example.eventexplorer.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        Role role = user.getRole();
        response.put("role", role != null ? role.name() : "USER");
        return response;
    }
}

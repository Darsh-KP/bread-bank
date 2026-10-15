package com.breadwinners.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.breadwinners.dto.auth.*;
import com.breadwinners.exception.*;
import com.breadwinners.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.status(201).body(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequestDto req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @ExceptionHandler(InvalidRegistrationException.class)
    public ResponseEntity<String> handleInvalidRegistration(InvalidRegistrationException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<String> handleDuplicateUser(DuplicateUserException e) {
        return ResponseEntity.status(409).body(e.getMessage());
    }
}

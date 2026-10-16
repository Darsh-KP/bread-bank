package com.breadwinners.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.breadwinners.dto.auth.*;
import com.breadwinners.exception.*;
import com.breadwinners.service.AuthService;
import com.breadwinners.service.RefreshService;

import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final RefreshService refreshService;

    public AuthController(AuthService authService, RefreshService refreshService) {
        this.authService = authService;
        this.refreshService = refreshService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.status(201).body(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequestDto req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @PostMapping ("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@CookieValue("refresh-token") String refreshToken) {
        return ResponseEntity.status(201).body(refreshService.refresh(refreshToken));
    }

    @ExceptionHandler(InvalidRegistrationException.class)
    public ResponseEntity<String> handleInvalidRegistration(InvalidRegistrationException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<String> handleDuplicateUser(DuplicateUserException e) {
        return ResponseEntity.status(409).body(e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body("Invalid username or password.");
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<String> handleInvalidRefreshToken(InvalidRefreshTokenException e) {
        return ResponseEntity.status(403).body("Invalid refresh token.");
    }
}

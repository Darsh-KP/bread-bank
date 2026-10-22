package com.breadwinners.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.breadwinners.dto.auth.*;
import com.breadwinners.exception.*;
import com.breadwinners.service.AuthService;
import com.breadwinners.service.RefreshService;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;

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
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequestDto req,
            HttpServletResponse response) {
        LoginResponse res = authService.login(req);

        String refreshToken = refreshService.generateRefreshToken(res.userResponse().username());

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ofDays(7))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequestDto req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @PostMapping ("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@CookieValue(name ="refresh_token", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.status(200).body(refreshService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        refreshService.revokeRefreshToken(refreshToken);

        ResponseCookie expiredCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
        return ResponseEntity.noContent().build();
    }
}

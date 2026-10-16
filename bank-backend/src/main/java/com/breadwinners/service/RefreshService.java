package com.breadwinners.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.breadwinners.dto.auth.RefreshResponse;
import com.breadwinners.exception.InvalidRefreshTokenException;
import com.breadwinners.model.RefreshToken;
import com.breadwinners.repository.RefreshTokenRepository;
import com.breadwinners.security.JwtUtil;

@Service 
public class RefreshService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    public RefreshService(RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    public RefreshResponse refresh(String refreshToken) {
        return new RefreshResponse(jwtUtil.generateToken(this.validateRefreshToken(refreshToken)));
    }

    public String generateRefreshToken(String username) {
        String refreshToken = UUID.randomUUID().toString();
        String tokenHash = hash(refreshToken);
        Instant expiresAt = Instant.now().plus(7, ChronoUnit.DAYS);

        refreshTokenRepository.save(new RefreshToken(username, tokenHash, expiresAt));

        return refreshToken;
    }

    public String validateRefreshToken(String refreshToken) {
        Optional<RefreshToken> rt = refreshTokenRepository.findByTokenHash(hash(refreshToken)).filter(token -> Instant.now().isBefore(token.getExpiresAt()));
        if (rt.isEmpty()) {
            throw new InvalidRefreshTokenException("Invalid refresh token.");
        }

        return rt.get().getUsername();
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 unavailable", exception);
        }
    }
}

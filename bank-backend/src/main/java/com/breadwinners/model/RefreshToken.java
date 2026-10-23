package com.breadwinners.model;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;

@Entity 
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter 
    @Column(nullable = false)
    private String username;

    @Getter 
    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Getter
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public RefreshToken() {}

    public RefreshToken(String username, String tokenHash, Instant expiresAt) {
        this.username = username;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }
}

package com.breadwinners.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(force = true, access = AccessLevel.PROTECTED)
@Table(name = "accounts")
@EqualsAndHashCode(of = "accountNumber")
public class Account {
    private static final SecureRandom RANDOM = new SecureRandom();

    private static long generateId() {
        return 100_000_000_000L
                + RANDOM.nextLong(900_000_000_000L);
    }

    @Id
    @Column(precision = 12, unique = true, nullable = false)
    @Getter
    private Long accountNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Getter
    @JoinColumn(
            referencedColumnName = "id",
            nullable = false
    )
    private AccountType accountType;

    @Getter
    @Column(length = 50, nullable = false)
    private String username;

    @Column(length = 50)
    @Getter @Setter
    private String nickname;

    @Column(precision = 17, scale = 2, nullable = false)
    @Getter @Setter
    private BigDecimal balance;

    @Column(nullable = false)
    @Getter @Setter
    private String pinHash;

    @Column(nullable = false, updatable = false)
    @Getter
    private LocalDateTime creationDate;

    @Column
    @Getter @Setter
    private LocalDateTime frozenUntil;

    public Account(AccountType accountType, String username, String nickname, BigDecimal balance, String pinHash,
        LocalDateTime creationDate, LocalDateTime frozenUntil) {
        this.accountNumber = generateId();

        this.accountType = accountType;

        if(this.accountType == null) {
            throw new IllegalArgumentException("Invalid account type.");
        }

        if(username == null || username.length() > 50) {
            throw new IllegalArgumentException("Invalid username.");
        } else {
            this.username = username;
        }

        this.nickname = (nickname == null || nickname.isBlank()) ? null : nickname.trim();

        if(balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative.");
        } else {
            this.balance = balance;
        }

        if(pinHash.isBlank()) {
            throw new IllegalArgumentException("PIN hash must not be blank.");
        } else {
            this.pinHash = pinHash;
        }

        if(creationDate == null) {
            throw new IllegalArgumentException("Creation date must exist.");
        } else {
            this.creationDate = creationDate;
        }

        this.frozenUntil = frozenUntil;
    }
}

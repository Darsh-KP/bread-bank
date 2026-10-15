package com.breadwinners.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "accounts")
@EqualsAndHashCode(of = "accountNumber")
public class Account {
    private static final SecureRandom RANDOM = new SecureRandom();

    private static long generateId() {
        return 100_000_000_000L
                + RANDOM.nextLong(900_000_000_000L);
    }

    @Id
    @Column(unique = true, nullable = false)
    @Getter
    private Long accountNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Getter
    @JoinColumn(name = "account_type", referencedColumnName = "id", nullable = false)
    private AccountType accountType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Getter
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private User user;

    @Column(length = 50)
    @Getter @Setter
    private String nickname;

    @Column(precision = 17, scale = 2, nullable = false)
    @Getter @Setter
    private BigDecimal balance;

    @Column(nullable = false)
    @Getter @Setter
    private String pinHash;

    @Generated(event = EventType.INSERT)
    @Column(nullable = false, insertable = false, updatable = false)
    @Getter
    private LocalDateTime creationDate;

    @Column
    @Getter @Setter
    private LocalDateTime frozenUntil;

    public Account(AccountType accountType, User user, String nickname, String pinHash, LocalDateTime frozenUntil) {
        this.accountNumber = generateId();

        this.accountType = Objects.requireNonNull(accountType, "Account type cannot be null");
        this.user = Objects.requireNonNull(user, "User cannot be null");

        this.nickname = (nickname == null || nickname.isBlank()) ? null : nickname.trim();

        this.balance = BigDecimal.ZERO;

        if (pinHash == null || pinHash.isBlank()) {
            throw new IllegalArgumentException("Invalid PIN hash");
        }

        this.pinHash = pinHash;
        this.frozenUntil = frozenUntil;
    }
}

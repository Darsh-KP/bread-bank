package com.breadwinners.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @Min(100_000_000_000L) @Max(999_999_999_999L)
    @Column(name = "account_number", precision = 12, scale = 0, unique = true, nullable = false)
    private long accountNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "account_type",
            referencedColumnName = "id",
            nullable = false
    )
    private AccountType accountType;

    @NotBlank @Size(max = 50)
    @Column(name = "username", length = 50, nullable = false)
    private String username;

    @Length(max = 50)
    @Column(name = "nickname", length = 50)
    String nickname;

    @NotNull
    @DecimalMin("0.00")
    @Digits(integer = 15, fraction = 2)
    @Column(name = "balance", precision = 17, scale = 2, nullable = false)
    BigDecimal balance;

    @NotEmpty @Length(max = 255)
    @Column(name = "pin_hash", length = 255, nullable = false)
    private String pinHash;

    @NotNull
    @Column(name = "creation_date", nullable = false, updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "frozen_until")
    private LocalDateTime frozenUntil;

    protected Account() {

    }
}

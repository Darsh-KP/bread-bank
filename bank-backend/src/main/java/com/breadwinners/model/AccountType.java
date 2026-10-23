package com.breadwinners.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor(force = true, access = AccessLevel.PROTECTED)
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Entity
public class AccountType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false, unique = true)
    String marketingName;

    @Column(nullable = false, precision = 7, scale = 5)
    BigDecimal interestRate;

    @Column(nullable = false)
    Integer maturationDays;

    public AccountType(String marketingName, BigDecimal interestRate, Integer maturationDays) {
        // Set the fields
        this.marketingName = (marketingName == null) ? null : marketingName.trim();
        this.interestRate = (interestRate == null) ? BigDecimal.valueOf(0.00) : interestRate.stripTrailingZeros();
        this.maturationDays = (maturationDays == null) ? 0 : maturationDays;

        // Check if marketing name is present
        if (this.marketingName == null || this.marketingName.isEmpty()) {
            throw new IllegalArgumentException("Marketing name must not be null or empty.");
        }

        // Check if marketing name is valid
        if (this.marketingName.length() > 50) {
            throw new IllegalArgumentException("Marketing name must not exceed 50 characters.");
        }

        // Check if interest rate is positive
        if (this.interestRate.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Interest rate must not be negative.");
        }

        // Check if interest rate has maximum 5 digits after decimal
        if (this.interestRate.scale() > 5) {
            throw new IllegalArgumentException("Interest rate scale must not exceed 5 decimal places.");
        }

        // Check if interest rate has maximum 2 digits before decimal
        if (this.interestRate.compareTo(new BigDecimal("100")) >= 0) {
            throw new IllegalArgumentException("Interest rate precision must be less than 100%.");
        }

        // Check if maturation days is valid
        if (this.maturationDays < 0) {
            throw new IllegalArgumentException("Maturation days must not be negative.");
        }
    }
}

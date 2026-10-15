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
        this.marketingName = (marketingName == null) ? null : marketingName.trim();
        this.interestRate = (interestRate == null) ? BigDecimal.valueOf(0.00) : interestRate;
        this.maturationDays = (maturationDays == null) ? 0 : maturationDays;

        if (this.marketingName == null || this.marketingName.isEmpty()) {
            throw new IllegalArgumentException("Marketing name cannot be null or empty.");
        }
        if (this.marketingName.length() > 50) {
            throw new IllegalArgumentException("Marketing name cannot exceed 50 characters.");
        }

        int integerDigits = this.interestRate.precision() - this.interestRate.scale();
        if (integerDigits > 2 || this.interestRate.scale() > 5) {
            throw new IllegalArgumentException("Interest rate exceeds numeric(7,5) bounds.");
        }

        if (this.interestRate.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Interest rate must not be negative.");
        }

        if (this.maturationDays < 0) {
            throw new IllegalArgumentException("Maturation days must not be negative.");
        }
    }
}

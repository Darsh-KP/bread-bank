package com.breadwinners.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Entity
@Table(name = "account_type")
public class AccountType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long account_type;

    @NotBlank @Size(max = 50)
    @Column(name = "marketing_name", nullable = false, unique = true, length = 50)
    private String marketingName;

    @DecimalMin("0.0") @DecimalMax("99.99999")
    @Digits(integer = 2, fraction = 5) @NotNull
    @Column(name = "interest_rate", precision = 7, scale = 5, nullable = false)
    private BigDecimal interestRate;

    @Min(0)
    @Column(name = "maturation_days")
    private Integer maturationDays;

    protected AccountType() {

    }
}

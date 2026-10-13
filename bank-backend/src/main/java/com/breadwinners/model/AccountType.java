package com.breadwinners.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Entity
public class AccountType {
    @Id
    @Column
    private Long account_type;

    @NotEmpty @Length(max = 50)
    @Column
    private String marketingName;

    @DecimalMin("0.0") @DecimalMax("99.99999")
    @Digits(integer = 2, fraction = 5) @NotNull
    @Column
    private BigDecimal interestRate;

    @Min(0)
    @Column
    private Integer maturationDays;
}

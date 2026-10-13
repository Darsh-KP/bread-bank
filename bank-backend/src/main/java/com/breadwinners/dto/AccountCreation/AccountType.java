package com.breadwinners.dto.AccountCreation;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/* For use on the account creation page. */
public record AccountType(
    @NotNull Long id,
    @NotBlank @Size(max = 50) String marketingName,
    @DecimalMin("0.0") @DecimalMax("99.99999")
    @Digits(integer = 2, fraction = 5) @DecimalMin("0.0")
        @NotNull BigDecimal annualYieldRate,
    @Min(0) Integer maturationDays
) {}

package com.breadwinners.dto.accountcreation;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/* For use on the account creation page. */
public record AccountTypeDto(
    @NotBlank(message = "There was some error finding the name of this BFS product.")
    @Size(max = 50, message = "Name too long for this BFS product.")
    String marketingName,

    @DecimalMin(value = "0.0", message = "Interest rate cannot be negative.")
    @Digits(integer = 2, fraction = 5) @NotNull(message = "APY must exist.")
    BigDecimal annualYieldRate,

    @NotNull(message = "All BFS products must have a time to mature.")
    @Min(value = 0, message = "Days until maturation must be non-negative.")
    Integer maturationDays
) {}

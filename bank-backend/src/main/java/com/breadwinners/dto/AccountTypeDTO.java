package com.breadwinners.dto;

import jakarta.validation.constraints.*;

public record AccountTypeDTO (
    @NotNull long id,
    @NotBlank String marketingName,
    @Min(0) int maturationDays,
    @Min(0) @Max(99_99999) int annualYieldRate
) {}

package com.breadwinners.dto.accountview;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AccountInformationRequestDto(
        @NotNull(message = "Account number is required.")
        @Min(value = 100_000_000_000L, message = "Account number must be 12 digits.")
        @Max(value = 999_999_999_999L, message = "Account number must be 12 digits.")
        Long accountNumber
) {}

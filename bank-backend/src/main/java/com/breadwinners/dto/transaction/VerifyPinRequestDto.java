package com.breadwinners.dto.transaction;

import jakarta.validation.constraints.*;

public record VerifyPinRequestDto(
        @NotNull(message = "Account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Account number must be exactly 12 digits.")
        Long accountNumber,

        @NotBlank(message = "PIN is required.")
        @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 numeric digits.")
        String pin
) {}

package com.breadwinners.dto.transaction;

import jakarta.validation.constraints.*;

import java.math.BigInteger;

public record TransactionRequestDto(
        @NotNull(message = "Account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Account number must be exactly 12 digits.")
        Long accountNumber,

        @NotBlank(message = "PIN is required.")
        @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 numeric digits.")
        String pin,

        @NotNull(message = "Amount is required.")
        @Min(value = 1, message = "Amount cannot be 0 or negative.")
        BigInteger amountInCents,

        @Size(max = 50, message = "Description cannot have more than 50 characters.")
        String description
) {}

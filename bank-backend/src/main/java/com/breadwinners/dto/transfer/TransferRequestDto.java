package com.breadwinners.dto.transfer;

import jakarta.validation.constraints.*;
import java.math.BigInteger;

public record TransferRequestDto(
        @NotNull(message = "Source account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Source account number must be exactly 12 digits.")
        Long fromAccountNumber,

        @NotNull(message = "Destination account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Destination account number must be exactly 12 digits.")
        Long toAccountNumber,

        @NotNull(message = "Amount is required.")
        @Min(value = 1, message = "Amount cannot be 0 or negative.")
        BigInteger amountInCents
) {}
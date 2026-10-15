package com.breadwinners.dto.transactionhistory;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransactionHistoryRequestDto(
    @NotNull(message = "Account number is required")
    @Positive(message = "Account number must be positive")
    Long accountNumber,

    @Min(value = 1, message = "Limit must be at least 1")
    @Max(value = 1000, message = "Limit must not exceed 1000")
    Integer limit
) {}
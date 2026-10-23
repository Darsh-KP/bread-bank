package com.breadwinners.dto.accountview;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

public record AccountInformationRequestDto(
        @NotNull(message = "Account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Account number must be exactly 12 digits.")
        Long accountNumber
) {}

package com.breadwinners.dto.accountview;

import jakarta.validation.constraints.*;

public record UpdateNicknameRequestDto(
        @NotNull(message = "Account number is required.")
        @Min(value = 100_000_000_000L, message = "Account number must be 12 digits.")
        @Max(value = 999_999_999_999L, message = "Account number must be 12 digits.")
        Long accountNumber,

        @NotBlank(message = "Nickname cannot be empty.")
        @Size(max = 50, message = "Nickname cannot have more than 50 characters.")
        String nickname
) {}

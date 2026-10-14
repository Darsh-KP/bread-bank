package com.breadwinners.dto.accountview;

import jakarta.validation.constraints.*;

public record UpdateNicknameRequestDto(
        @NotNull(message = "Account number is required.")
        @Digits(integer = 12, fraction = 0, message = "Account number must be exactly 12 digits.")
        Long accountNumber,

        @NotBlank(message = "Nickname cannot be empty.")
        @Size(max = 50, message = "Nickname cannot have more than 50 characters.")
        String nickname
) {}

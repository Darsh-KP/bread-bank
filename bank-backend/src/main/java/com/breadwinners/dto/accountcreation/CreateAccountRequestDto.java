package com.breadwinners.dto.accountcreation;

import jakarta.validation.constraints.*;

public record CreateAccountRequestDto(
        @NotNull(message = "Please select a product.")
        String accountType,
        @Size(max = 50, message = "Nickname too long.")
        String nickname,
        @NotBlank(message = "PIN is required.")
        @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 numeric digits.")
        String pin
) {}

package com.breadwinners.dto.auth;

import jakarta.validation.constraints.*;

public record LoginRequestDto(
    @NotBlank(message = "Username is required")
    String userName,

    @NotBlank(message = "Password is required")
    String password
) {}

package com.breadwinners.dto.auth;

import jakarta.validation.constraints.*;

public record RegisterRequestDto(
    @NotBlank(message = "First name is required")
    @Size(max = 30, message = "First name must not exceed 30 characters")
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(max = 30, message = "Last name must not exceed 30 characters")
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email must not exceed 254 characters")
    String email,

    @NotBlank(message = "Phone number is required")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Pattern(
        regexp = "^\\+?[\\s(]*(?:[0-9][\\s\\-() ]*){10,14}$",
        message = "Phone number must contain between 10 and 14 digits"
    )
    String phone,

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = ".*\\d.*", message = "Password must include at least 1 digit")
    @Pattern(regexp = ".*[a-z].*", message = "Password must include at least 1 lowercase character")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must include at least 1 uppercase character")
    String password
) {}

package com.breadwinners.dto.userSettings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPasswordUpdateRequestDto (

    @NotBlank(message = "Old Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    String oldPassword,

    @NotBlank(message = "New Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    String newPassword
    ){}


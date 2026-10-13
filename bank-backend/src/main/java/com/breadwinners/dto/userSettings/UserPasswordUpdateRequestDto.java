package com.breadwinners.dto.userSettings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPasswordUpdateRequestDto (

    @NotBlank(message = "Username required")
    @Size(max = 50)
    String username,

    @NotBlank(message = "Old Password is required")
    String oldPassword,

    @NotBlank(message = "New Password is required")
    String newPassword
    ){}


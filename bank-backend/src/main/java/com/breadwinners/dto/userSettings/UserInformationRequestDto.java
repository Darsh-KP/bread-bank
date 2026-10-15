package com.breadwinners.dto.userSettings;

import jakarta.validation.constraints.NotBlank;

public record UserInformationRequestDto(

    @NotBlank(message = "Username required")
    String username
)
{}

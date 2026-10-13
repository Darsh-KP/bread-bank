package com.breadwinners.bank.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.Instant;

public record UserAccountDTO (
    // @NotNull @Valid UserDTO owner,
    @NotNull @Valid AccountTypeDTO type,
    String nickname,
    @NotBlank String hashedPin,
    @Min(0) long balanceCents,
    @NotNull Instant creationDate,
    Instant frozenUntil
) {}

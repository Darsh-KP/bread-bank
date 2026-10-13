package com.breadwinners.dto.AccountView;

import com.breadwinners.dto.AccountCreation.AccountTypeDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.Instant;

public record UserAccountDTO (
    // @NotNull @Valid UserDTO owner,
    @NotNull @Valid AccountTypeDTO type,
    String nickname,
    @NotBlank String hashedPin,
    @Min(0) long balanceCents,
    Instant frozenUntil
) {}

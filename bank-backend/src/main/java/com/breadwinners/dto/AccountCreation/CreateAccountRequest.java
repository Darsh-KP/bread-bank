package com.breadwinners.dto.AccountCreation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record CreateAccountRequest(
    @NotNull @Min(0) Long accountTypeId,
    String nickname,
    @NotNull @Length(min = 4, max = 4) String pin
) {}

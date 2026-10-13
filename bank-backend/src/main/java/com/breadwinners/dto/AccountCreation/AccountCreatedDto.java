package com.breadwinners.dto.AccountCreation;

public record AccountCreatedDto(
    Long accountNumber // If this is null, then report a failure in the UI.
) {}

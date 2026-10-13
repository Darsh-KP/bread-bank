package com.breadwinners.dto.AccountCreation;

public record AccountCreated (
    Long accountNumber // If this is null, then report a failure in the UI.
) {}

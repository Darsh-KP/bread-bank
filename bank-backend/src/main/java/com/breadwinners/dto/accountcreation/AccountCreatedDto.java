package com.breadwinners.dto.accountcreation;

public record AccountCreatedDto(
    Long accountNumber // If this is null, then report a failure in the UI.
) {}

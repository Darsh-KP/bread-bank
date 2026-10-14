package com.breadwinners.dto.dashboardaccounts;

import jakarta.validation.constraints.*;

// TODO: figure out the standardized object for accounts
public record AllAccountsResponseDto(
        @NotNull Boolean success,
        @NotNull List<Account> accounts
) {}
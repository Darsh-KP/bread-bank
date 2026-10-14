package com.breadwinners.dto.dashboardaccounts;

import jakarta.validation.constraints.*;

public record AllAccountsRequestDto(
        @NotNull String username
) {}
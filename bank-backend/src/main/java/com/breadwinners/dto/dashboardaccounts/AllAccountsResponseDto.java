package com.breadwinners.dto.dashboardaccounts;

import java.util.List;

// TODO: figure out the standardized object for accounts
public record AllAccountsResponseDto(List<AccountSummaryResponseDto> accounts) {
    public AllAccountsResponseDto {
        accounts = List.copyOf(accounts);
    }
}
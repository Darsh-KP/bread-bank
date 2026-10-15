package com.breadwinners.dto.dashboardaccounts;

public record AccountSummaryResponseDto(
        Long accountId,
        String accountTypeName,
        String nickname,
        String lastFour,
        Integer balanceInCents
) {}

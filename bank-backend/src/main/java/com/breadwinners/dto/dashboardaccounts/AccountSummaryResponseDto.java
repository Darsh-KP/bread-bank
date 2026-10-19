package com.breadwinners.dto.dashboardaccounts;

public record AccountSummaryResponseDto(
        Long accountNumber,
        String marketingName,
        String nickname,
        BigInteger balanceInCents
) {}

package com.breadwinners.dto.dashboardaccounts;

import java.math.BigInteger;

public record AccountSummaryResponseDto(
        Long accountNumber,
        String marketingName,
        String nickname,
        BigInteger balanceInCents
) {}

package com.breadwinners.dto.accountview;

import java.math.BigInteger;

public record AccountInformationResponseDto(
        Long accountNumber,
        String marketingName,
        String nickname,
        BigInteger balanceInCents
) {}

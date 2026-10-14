package com.breadwinners.dto.accountview;

import java.math.BigInteger;

public record AccountInformationResponseDto(
        Long accountNumber,
        String nickname,
        BigInteger balanceInCents
) {}

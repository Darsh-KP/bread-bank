package com.breadwinners.dto.transaction;

import java.math.BigInteger;

public record TransactionResponseDto(
        Boolean isSuccessful,
        BigInteger amountInCents
) {}

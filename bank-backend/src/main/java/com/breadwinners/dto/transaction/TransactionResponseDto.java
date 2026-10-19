package com.breadwinners.dto.transaction;

import java.math.BigInteger;

public record TransactionResponseDto(
        BigInteger amountInCents
) {}

package com.breadwinners.dto.transfer;

import java.math.BigInteger;

public record TransferResponseDto(
        Boolean isSuccessful,
        BigInteger amountInCents,
        BigInteger sourceBalanceInCents,
        BigInteger destinationBalanceInCents
) {}
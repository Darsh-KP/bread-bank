package com.breadwinners.dto.transactionhistory;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionHistoryItemDto(
    String id,
    TransactionHistoryType type,
    BigDecimal amount,
    BigDecimal balanceAfter,
    String description,
    Instant createdAt
) {}

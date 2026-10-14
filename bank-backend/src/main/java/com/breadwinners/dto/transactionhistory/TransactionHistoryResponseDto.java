package com.breadwinners.dto.transactionhistory;

import java.util.List;

public record TransactionHistoryResponseDto(List<TransactionHistoryItemDto> transactions) {}

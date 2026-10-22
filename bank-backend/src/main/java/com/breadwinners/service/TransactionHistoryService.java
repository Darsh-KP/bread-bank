package com.breadwinners.service;

import com.breadwinners.dto.transactionhistory.TransactionHistoryItemDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryResponseDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryType;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.model.TransactionHistory;
import com.breadwinners.model.User;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.TransactionHistoryRepository;
import com.breadwinners.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class TransactionHistoryService {

    // Used when the request does not send a limit. Matches the @Max on the request DTO.
    static final int DEFAULT_LIMIT = 1000;

    private final TransactionHistoryRepository transactionHistoryRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
// set the repositories through constructor injection
    public TransactionHistoryService(TransactionHistoryRepository transactionHistoryRepository,
                                     AccountRepository accountRepository,
                                     UserRepository userRepository) {
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    /**
     * Returns the account's transactions, newest first.
     *
     * @throws AccountNotFoundException if the account does not exist OR belongs to
     *         someone else (same answer for both, so callers cannot probe account numbers)
     */
    @Transactional(readOnly = true)
    public TransactionHistoryResponseDto getHistory(String username, Long accountNumber, Integer limit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccountNotFoundException("No account found for the given account number."));

        if (!accountRepository.existsByAccountNumberAndUser(accountNumber, user)) {
            throw new AccountNotFoundException("No account found for the given account number.");
        }

        int pageSize = (limit == null) ? DEFAULT_LIMIT : limit;

        List<TransactionHistoryItemDto> items = transactionHistoryRepository
                .findHistoryByAccountNumber(accountNumber, PageRequest.of(0, pageSize))
                .stream()
                .map(row -> toItem(row, accountNumber))
                .toList();

        return new TransactionHistoryResponseDto(items);
    }

    // Turns one stored row into what the viewed account should see.
    private TransactionHistoryItemDto toItem(TransactionHistory row, Long viewedAccount) {
        TransactionHistoryType type;
        BigDecimal balanceAfter;

        switch (row.getTransactionType()) {
            case DEPOSIT -> {
                type = TransactionHistoryType.DEPOSIT;
                balanceAfter = row.getSourceBalanceAfter();
            }
            case WITHDRAW -> {
                type = TransactionHistoryType.WITHDRAW;
                balanceAfter = row.getSourceBalanceAfter();
            }
            case TRANSFER -> {
                if (viewedAccount.equals(row.getSourceAccount())) {
                    type = TransactionHistoryType.TRANSFER_OUT;
                    balanceAfter = row.getSourceBalanceAfter();
                } else {
                    type = TransactionHistoryType.TRANSFER_IN;
                    balanceAfter = row.getDestinationBalanceAfter();
                }
            }
            default -> throw new IllegalStateException("Unknown transaction type: " + row.getTransactionType());
        }

        return new TransactionHistoryItemDto(
                String.valueOf(row.getId()),
                type,
                row.getAmount(),
                balanceAfter,
                row.getDescription(),
                row.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()
        );
    }
}

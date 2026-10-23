package com.breadwinners.service;

import com.breadwinners.dto.transaction.TransactionRequestDto;
import com.breadwinners.dto.transaction.TransactionResponseDto;
import com.breadwinners.dto.transaction.VerifyPinRequestDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.exception.BalanceExceededException;
import com.breadwinners.exception.InsufficientBalanceException;
import com.breadwinners.model.Account;
import com.breadwinners.model.TransactionHistory;
import com.breadwinners.model.TransactionType;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.TransactionHistoryRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    // Maximum valid balance
    private static final BigDecimal MAX_BALANCE = new BigDecimal("999999999999999.99");

    // Constructor injection to initialize required dependencies
    public TransactionService(AccountRepository accountRepository, TransactionHistoryRepository transactionHistoryRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void verifyAccountPin(String username, VerifyPinRequestDto verifyPinRequestDto) {
        // Verify the PIN
        getValidatedAccount(
                username,
                verifyPinRequestDto.accountNumber(),
                verifyPinRequestDto.pin()
        );
    }

    @Transactional
    public TransactionResponseDto processDeposit(String username, TransactionRequestDto transactionRequestDto) {
        // Get the account
        Account account = getValidatedAccount(
                username,
                transactionRequestDto.accountNumber(),
                transactionRequestDto.pin()
        );

        // Get the description
        String description = transactionRequestDto.description();
        description = description == null || description.isBlank() ? null : description.trim();

        // Get the amount for transaction
        BigDecimal amount = new BigDecimal(transactionRequestDto.amountInCents()).movePointLeft(2);

        // Calculate the new balance
        BigDecimal newBalance = account.getBalance().add(amount);

        // Check if the new balance is valid (allowed)
        if (newBalance.compareTo(MAX_BALANCE) > 0) {
            throw new BalanceExceededException("Account will exceed maximum balance. Contact customer support.");
        }

        // Update the balance
        account.setBalance(newBalance);

        // Create the transaction history
        TransactionHistory transactionHistory = new TransactionHistory(
                transactionRequestDto.accountNumber(),
                null,
                LocalDateTime.now(),
                amount,
                newBalance,
                null,
                TransactionType.DEPOSIT,
                description
        );

        // Save the transaction history
        transactionHistoryRepository.save(transactionHistory);

        // Transaction successful!
        return new TransactionResponseDto(
                transactionRequestDto.amountInCents()
        );
    }

    @Transactional
    public TransactionResponseDto processWithdrawal(String username, TransactionRequestDto transactionRequestDto) {
        // Get the account
        Account account = getValidatedAccount(
                username,
                transactionRequestDto.accountNumber(),
                transactionRequestDto.pin()
        );

        // Get the description
        String description = transactionRequestDto.description();
        description = description == null || description.isBlank() ? null : description.trim();

        // Get the amount for transaction
        BigDecimal amount = new BigDecimal(transactionRequestDto.amountInCents()).movePointLeft(2);

        // Check if account has enough balance
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance.");
        }

        // Calculate the new balance
        BigDecimal newBalance = account.getBalance().subtract(amount);

        // Update the new balance
        account.setBalance(newBalance);

        // Create the transaction history
        TransactionHistory transactionHistory = new TransactionHistory(
                transactionRequestDto.accountNumber(),
                null,
                LocalDateTime.now(),
                amount,
                newBalance,
                null,
                TransactionType.WITHDRAW,
                description
        );

        // Save the transaction history
        transactionHistoryRepository.save(transactionHistory);

        // Transaction successful!
        return new  TransactionResponseDto(
                transactionRequestDto.amountInCents()
        );
    }

    // Helper method to validate PIN and get account
    private Account getValidatedAccount(String username, Long accountNumber, String rawPin) {
        // Find the account
        Account account = accountRepository.findByAccountNumberAndUser_Username(accountNumber, username)
                .orElseThrow(() -> new AccountNotFoundException("Account or user not found."));

        // Check if the PIN matches
        if (!passwordEncoder.matches(rawPin, account.getPinHash())) {
            throw new BadCredentialsException("PIN is incorrect.");
        }

        // Return verified account
        return account;
    }
}

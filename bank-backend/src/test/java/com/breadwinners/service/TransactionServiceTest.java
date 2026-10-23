package com.breadwinners.service;

import com.breadwinners.dto.transaction.TransactionRequestDto;
import com.breadwinners.dto.transaction.TransactionResponseDto;
import com.breadwinners.dto.transaction.VerifyPinRequestDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.exception.BalanceExceededException;
import com.breadwinners.exception.InsufficientBalanceException;
import com.breadwinners.model.*;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.TransactionHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionHistoryRepository transactionHistoryRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TransactionService transactionService;

    private static final String USERNAME = "ironman";
    private static final String RAW_PIN = "1234";
    private static final String PIN_HASH = "$argon2id$mockedhash";

    private User sharedUser;
    private AccountType sharedAccountType;

    @BeforeEach
    void setUp() {
        sharedUser = mock(User.class);
        sharedAccountType = mock(AccountType.class);
    }

    @Nested
    @DisplayName("Tests for verifyAccountPin")
    class VerifyAccountPinTests {

        @Test
        @DisplayName("Should execute silently when account exists and pin matches hash code string validation")
        void verifyAccountPin_Success() {
            VerifyPinRequestDto requestDto = new VerifyPinRequestDto(100000000000L, RAW_PIN);
            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);

            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(true);

            assertDoesNotThrow(() -> transactionService.verifyAccountPin(USERNAME, requestDto));
        }

        @Test
        @DisplayName("Should throw AccountNotFoundException when account query yields no results")
        void verifyAccountPin_AccountNotFound() {
            VerifyPinRequestDto requestDto = new VerifyPinRequestDto(100000000000L, RAW_PIN);
            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.empty());

            assertThrows(AccountNotFoundException.class, () ->
                    transactionService.verifyAccountPin(USERNAME, requestDto)
            );
        }

        @Test
        @DisplayName("Should throw BadCredentialsException when Pin evaluation fails security match checking")
        void verifyAccountPin_InvalidPin() {
            VerifyPinRequestDto requestDto = new VerifyPinRequestDto(100000000000L, RAW_PIN);
            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);

            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(false);

            assertThrows(BadCredentialsException.class, () ->
                    transactionService.verifyAccountPin(USERNAME, requestDto)
            );
        }
    }

    @Nested
    @DisplayName("Tests for processDeposit")
    class ProcessDepositTests {

        @Test
        @DisplayName("Should accumulate balance and persist data cleanly on a valid deposit transaction")
        void processDeposit_Success() {
            BigInteger amountInCents = new BigInteger("25075");
            TransactionRequestDto requestDto = new TransactionRequestDto(
                    100000000000L, RAW_PIN, amountInCents, "  Work Paycheck  "
            );

            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);
            account.setBalance(new BigDecimal("100.00"));

            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(true);

            TransactionResponseDto response = transactionService.processDeposit(USERNAME, requestDto);

            assertNotNull(response);
            assertEquals(amountInCents, response.amountInCents());
            assertEquals(new BigDecimal("350.75"), account.getBalance());
        }

        @Test
        @DisplayName("Should throw BalanceExceededException and cancel actions if ledger surpasses maximum allowed value")
        void processDeposit_ExceedsMaxBalanceLimit() {
            BigDecimal maxAllowedBalance = new BigDecimal("999999999999999.99");
            TransactionRequestDto requestDto = new TransactionRequestDto(
                    100000000000L, RAW_PIN, new BigInteger("100"), "Overflow attempt"
            );

            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);
            account.setBalance(maxAllowedBalance);

            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(true);

            assertThrows(BalanceExceededException.class, () ->
                    transactionService.processDeposit(USERNAME, requestDto)
            );

            verify(transactionHistoryRepository, never()).save(any(TransactionHistory.class));
            assertEquals(maxAllowedBalance, account.getBalance());
        }
    }

    @Nested
    @DisplayName("Tests for processWithdrawal")
    class ProcessWithdrawalTests {

        @Test
        @DisplayName("Should decrement active balance value and write log payload when coverage checks pass")
        void processWithdrawal_Success() {
            BigInteger amountInCents = new BigInteger("4000");
            TransactionRequestDto requestDto = new TransactionRequestDto(
                    100000000000L, RAW_PIN, amountInCents, "ATM Cash out"
            );

            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);
            account.setBalance(new BigDecimal("100.00"));

            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(true);

            TransactionResponseDto response = transactionService.processWithdrawal(USERNAME, requestDto);

            assertNotNull(response);
            assertEquals(amountInCents, response.amountInCents());
            assertEquals(new BigDecimal("60.00"), account.getBalance());
        }

        @Test
        @DisplayName("Should throw InsufficientBalanceException if debit value completely exceeds current ledger balance")
        void processWithdrawal_InsufficientFundsError() {
            TransactionRequestDto requestDto = new TransactionRequestDto(
                    100000000000L, RAW_PIN, new BigInteger("5000"), "Rent payment"
            );
            Account account = new Account(sharedAccountType, sharedUser, "Checking", PIN_HASH, null);
            account.setBalance(new BigDecimal("20.00"));
            when(accountRepository.findByAccountNumberAndUser_Username(requestDto.accountNumber(), USERNAME))
                    .thenReturn(Optional.of(account));
            when(passwordEncoder.matches(RAW_PIN, PIN_HASH)).thenReturn(true);

            assertThrows(InsufficientBalanceException.class, () ->
                    transactionService.processWithdrawal(USERNAME, requestDto)
            );
            verify(transactionHistoryRepository, never()).save(any(TransactionHistory.class));
            assertEquals(new BigDecimal("20.00"), account.getBalance());
        }
    }
}
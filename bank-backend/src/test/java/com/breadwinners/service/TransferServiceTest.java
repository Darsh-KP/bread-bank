
package com.breadwinners.service;

import com.breadwinners.dto.transfer.TransferRequestDto;
import com.breadwinners.dto.transfer.TransferResponseDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.exception.InvalidTransferException;
import com.breadwinners.model.Account;
import com.breadwinners.model.TransactionHistory;
import com.breadwinners.model.TransactionType;
import com.breadwinners.model.User;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.repository.TransactionHistoryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.BeanUtils;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionHistoryRepository transactionHistoryRepository;

    @InjectMocks
    private TransferService transferService;

    private User user;
    private Account source;
    private Account destination;

    private final String username = "testuser";
    private final Long sourceNumber = 123456789012L;
    private final Long destinationNumber = 987654321098L;

    @BeforeEach
    void setUp() {
        user = mock(User.class);
        source = mock(Account.class);
        destination = mock(Account.class);
    }

    private void mockAuthenticatedUser() {
        when(userRepository.findByUsername(username))
                .thenReturn(Optional.of(user));
        }

    private void mockAccounts() {
        when(accountRepository.findByAccountNumberAndUser(sourceNumber, user))
                .thenReturn(Optional.of(source));
        when(accountRepository.findById(destinationNumber))
                .thenReturn(Optional.of(destination));
    }

    
    private Account realAccount(Long number, String balance) {
        Account account = BeanUtils.instantiateClass(Account.class);
        ReflectionTestUtils.setField(account, "accountNumber", number);
        ReflectionTestUtils.setField(account, "balance", new BigDecimal(balance));
        return account;
}

    @Test
    void successfulTransferUpdatesBothBalances() {
        mockAuthenticatedUser();
        mockAccounts();

        when(source.getBalance()).thenReturn(new BigDecimal("500.00"));
        when(destination.getBalance()).thenReturn(new BigDecimal("200.00"));

        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, destinationNumber, BigInteger.valueOf(10000)
        );

        TransferResponseDto response = transferService.transfer(username, request);

        verify(source).setBalance(new BigDecimal("400.00"));
        verify(destination).setBalance(new BigDecimal("300.00"));

        verify(accountRepository).save(source);
        verify(accountRepository).save(destination);

        assertEquals(Boolean.TRUE, response.isSuccessful());
        assertEquals(BigInteger.valueOf(10000), response.amountInCents());
    }

    @Test
    void insufficientFundsRejectsTransfer() {
        mockAuthenticatedUser();
        mockAccounts();

        when(source.getBalance()).thenReturn(new BigDecimal("50.00"));

        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, destinationNumber, BigInteger.valueOf(10000)
        );

        assertThrows(InvalidTransferException.class,
                () -> transferService.transfer(username, request));

        verify(accountRepository, never()).save(any(Account.class));
        verify(transactionHistoryRepository, never()).save(any());
    }

    @Test
    void sameAccountTransferIsRejected() {
        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, sourceNumber, BigInteger.valueOf(10000)
        );

        assertThrows(InvalidTransferException.class,
                () -> transferService.transfer(username, request));

        verifyNoInteractions(accountRepository, transactionHistoryRepository);
    }

    @Test
    void unauthorizedSourceAccountIsRejected() {
        mockAuthenticatedUser();

        when(accountRepository.findByAccountNumberAndUser(sourceNumber, user))
                .thenReturn(Optional.empty());

        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, destinationNumber, BigInteger.valueOf(10000)
        );

        assertThrows(AccountNotFoundException.class,
                () -> transferService.transfer(username, request));

        verify(accountRepository, never()).save(any(Account.class));
        verify(transactionHistoryRepository, never()).save(any());
    }

    @Test
    void missingDestinationAccountIsRejected() {
        mockAuthenticatedUser();

        when(accountRepository.findByAccountNumberAndUser(sourceNumber, user))
                .thenReturn(Optional.of(source));

        when(accountRepository.findById(destinationNumber))
                .thenReturn(Optional.empty());

        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, destinationNumber, BigInteger.valueOf(10000)
        );

        assertThrows(AccountNotFoundException.class,
                () -> transferService.transfer(username, request));

        verify(accountRepository, never()).save(any(Account.class));
        verify(transactionHistoryRepository, never()).save(any());
    }

    @Test
    void successfulTransferReturnsCorrectResponse() {
        mockAuthenticatedUser();
        mockAccounts();

        when(source.getBalance()).thenReturn(new BigDecimal("500.00"));
        when(destination.getBalance()).thenReturn(new BigDecimal("200.00"));

        TransferRequestDto request = new TransferRequestDto(
                sourceNumber, destinationNumber, BigInteger.valueOf(2500)
        );

        TransferResponseDto response = transferService.transfer(username, request);

        assertTrue(response.isSuccessful());
        assertEquals(BigInteger.valueOf(2500), response.amountInCents());
    }

    @Test
    void successfulTransferRecordsTransactionHistory() {
    Account realSource = realAccount(sourceNumber, "500.00");
    Account realDestination = realAccount(destinationNumber, "200.00");

    when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
    when(accountRepository.findByAccountNumberAndUser(sourceNumber, user))
            .thenReturn(Optional.of(realSource));
    when(accountRepository.findById(destinationNumber))
            .thenReturn(Optional.of(realDestination));

    TransferRequestDto request = new TransferRequestDto(
            sourceNumber, destinationNumber, BigInteger.valueOf(10000)   );

    transferService.transfer(username, request);

    // check whether the balances really changed
    assertEquals(0, new BigDecimal("400.00").compareTo(realSource.getBalance()));
    assertEquals(0, new BigDecimal("300.00").compareTo(realDestination.getBalance()));

    ArgumentCaptor<TransactionHistory> captor = ArgumentCaptor.forClass(TransactionHistory.class);
    verify(transactionHistoryRepository).save(captor.capture());
    TransactionHistory saved = captor.getValue();

    assertEquals(sourceNumber, saved.getSourceAccount());
    assertEquals(destinationNumber, saved.getDestinationAccount());
    assertEquals(0, new BigDecimal("100.00").compareTo(saved.getAmount()));
    assertEquals(0, new BigDecimal("400.00").compareTo(saved.getSourceBalanceAfter()));
    assertEquals(0, new BigDecimal("300.00").compareTo(saved.getDestinationBalanceAfter()));
    assertEquals(TransactionType.TRANSFER, saved.getTransactionType());
    assertNotNull(saved.getCreatedAt());
}
}

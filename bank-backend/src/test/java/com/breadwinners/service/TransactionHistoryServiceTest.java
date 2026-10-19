package com.breadwinners.service;

import com.breadwinners.dto.transactionhistory.TransactionHistoryResponseDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryType;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.model.TransactionHistory;
import com.breadwinners.model.TransactionType;
import com.breadwinners.model.User;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.TransactionHistoryRepository;
import com.breadwinners.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionHistoryServiceTest {

    private static final Long SENDER = 100000000001L;
    private static final Long RECEIVER = 100000000002L;

    @Mock private TransactionHistoryRepository transactionHistoryRepository;
    @Mock private AccountRepository accountRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private TransactionHistoryService service;

    private final User user = new User("breadboi", "hash", "Bread", "Boi", "b@example.com", "7325550101");

    private TransactionHistory transfer() {
        return new TransactionHistory(SENDER, RECEIVER, LocalDateTime.of(2026, 9, 5, 11, 0),
                new BigDecimal("120.00"), new BigDecimal("3295.50"), new BigDecimal("480.00"),
                TransactionType.TRANSFER, "To Baker Billy");
    }

    private void userOwns(Long account) {
        when(userRepository.findByUsername("breadboi")).thenReturn(Optional.of(user));
        when(accountRepository.existsByAccountNumberAndUser(account, user)).thenReturn(true);
    }

    @Test
    void transferIsOutForTheSenderWithSenderBalance() {
        userOwns(SENDER);
        when(transactionHistoryRepository.findHistoryByAccountNumber(eq(SENDER), any(Pageable.class)))
                .thenReturn(List.of(transfer()));

        TransactionHistoryResponseDto result = service.getHistory("breadboi", SENDER, 10);

        assertThat(result.transactions()).hasSize(1);
        assertThat(result.transactions().get(0).type()).isEqualTo(TransactionHistoryType.TRANSFER_OUT);
        assertThat(result.transactions().get(0).balanceAfter()).isEqualByComparingTo("3295.50");
    }

    @Test
    void transferIsInForTheReceiverWithReceiverBalance() {
        userOwns(RECEIVER);
        when(transactionHistoryRepository.findHistoryByAccountNumber(eq(RECEIVER), any(Pageable.class)))
                .thenReturn(List.of(transfer()));

        TransactionHistoryResponseDto result = service.getHistory("breadboi", RECEIVER, 10);

        assertThat(result.transactions().get(0).type()).isEqualTo(TransactionHistoryType.TRANSFER_IN);
        assertThat(result.transactions().get(0).balanceAfter()).isEqualByComparingTo("480.00");
    }

    @Test
    void noLimitDefaultsTo1000() {
        userOwns(SENDER);
        when(transactionHistoryRepository.findHistoryByAccountNumber(eq(SENDER), any(Pageable.class)))
                .thenReturn(List.of());

        service.getHistory("breadboi", SENDER, null);

        ArgumentCaptor<Pageable> page = ArgumentCaptor.forClass(Pageable.class);
        verify(transactionHistoryRepository).findHistoryByAccountNumber(eq(SENDER), page.capture());
        assertThat(page.getValue().getPageSize()).isEqualTo(1000);
    }

    @Test
    void accountOwnedBySomeoneElseThrowsNotFound() {
        when(userRepository.findByUsername("breadboi")).thenReturn(Optional.of(user));
        when(accountRepository.existsByAccountNumberAndUser(SENDER, user)).thenReturn(false);

        assertThatThrownBy(() -> service.getHistory("breadboi", SENDER, 10))
                .isInstanceOf(AccountNotFoundException.class);
        verify(transactionHistoryRepository, never()).findHistoryByAccountNumber(any(), any());
    }
}
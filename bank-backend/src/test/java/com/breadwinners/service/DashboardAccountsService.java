package com.breadwinners.service;

import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.Account;
import com.breadwinners.model.AccountType;
import com.breadwinners.model.User;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardAccountsServiceTest {

    private static final String USERNAME = "breadboi";

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DashboardAccountsService service;

    private final User user = new User(
            USERNAME, "hash", "Bread", "Boi", "bread@example.com", "7325550101"
    );

    @Test
    void returnsAccountSummariesWithBalancesInCents() {
        AccountType checkingType = mock(AccountType.class);
        when(checkingType.getMarketingName()).thenReturn("Everyday Checking");

        Account checkingAccount = mock(Account.class);
        when(checkingAccount.getAccountNumber()).thenReturn(100000000001L);
        when(checkingAccount.getAccountType()).thenReturn(checkingType);
        when(checkingAccount.getNickname()).thenReturn("Main account");
        when(checkingAccount.getBalance()).thenReturn(new BigDecimal("125.50"));

        AccountType savingsType = mock(AccountType.class);
        when(savingsType.getMarketingName()).thenReturn("Savings");

        Account savingsAccount = mock(Account.class);
        when(savingsAccount.getAccountNumber()).thenReturn(100000000002L);
        when(savingsAccount.getAccountType()).thenReturn(savingsType);
        when(savingsAccount.getNickname()).thenReturn("Rainy day fund");
        when(savingsAccount.getBalance()).thenReturn(new BigDecimal("10.00"));

        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(accountRepository.findAllByUser(user))
                .thenReturn(List.of(checkingAccount, savingsAccount));

        var result = service.getAccountsForUser(USERNAME);

        assertThat(result.accounts()).containsExactly(
                new com.breadwinners.dto.dashboardaccounts.AccountSummaryResponseDto(
                        100000000001L, "Everyday Checking", "Main account",
                        new BigInteger("12550")),
                new com.breadwinners.dto.dashboardaccounts.AccountSummaryResponseDto(
                        100000000002L, "Savings", "Rainy day fund",
                        new BigInteger("1000"))
        );

        verify(userRepository).findByUsername(USERNAME);
        verify(accountRepository).findAllByUser(user);
    }

    @Test
    void returnsEmptyAccountListWhenUserHasNoAccounts() {
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(accountRepository.findAllByUser(user)).thenReturn(List.of());

        var result = service.getAccountsForUser(USERNAME);

        assertThat(result.accounts()).isEmpty();
        verify(accountRepository).findAllByUser(user);
    }

    @Test
    void throwsWhenUserDoesNotExist() {
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getAccountsForUser(USERNAME))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User data does not exist.");

        verify(accountRepository, never()).findAllByUser(any());
    }
}
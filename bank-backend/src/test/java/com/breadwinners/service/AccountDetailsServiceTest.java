package com.breadwinners.service;

import com.breadwinners.dto.accountview.AccountInformationRequestDto;
import com.breadwinners.dto.accountview.AccountInformationResponseDto;
import com.breadwinners.dto.accountview.UpdateNicknameRequestDto;
import com.breadwinners.dto.accountview.UpdateNicknameResponseDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.model.Account;
import com.breadwinners.model.AccountType;
import com.breadwinners.repository.AccountRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountDetailsServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountDetailsService accountDetailsService;

    @Nested
    @DisplayName("Tests for fetchAccountDetails")
    class FetchAccountDetailsTests {

        @Test
        @DisplayName("Should return valid response DTO and correctly map balance to cents when account is found")
        void fetchAccountDetails_Success() {
            Long accountNumber = 123456789012L;
            AccountInformationRequestDto requestDto = new AccountInformationRequestDto(accountNumber);

            AccountType mockType = mock(AccountType.class);
            when(mockType.getMarketingName()).thenReturn("Premium Checking");

            Account mockAccount = mock(Account.class);
            when(mockAccount.getAccountNumber()).thenReturn(accountNumber);
            when(mockAccount.getAccountType()).thenReturn(mockType);
            when(mockAccount.getNickname()).thenReturn("My Main Account");
            when(mockAccount.getBalance()).thenReturn(new BigDecimal("150.50"));

            when(accountRepository.findById(accountNumber)).thenReturn(Optional.of(mockAccount));

            AccountInformationResponseDto response = accountDetailsService.fetchAccountDetails(requestDto);

            assertNotNull(response);
            assertEquals(accountNumber, response.accountNumber());
            assertEquals("Premium Checking", response.marketingName());
            assertEquals("My Main Account", response.nickname());
            assertEquals(new BigInteger("15050"), response.balanceInCents());

            verify(accountRepository, times(1)).findById(accountNumber);
        }

        @Test
        @DisplayName("Should throw AccountNotFoundException when account number does not exist in repository")
        void fetchAccountDetails_NotFound() {
            Long accountNumber = 999999999999L;
            AccountInformationRequestDto requestDto = new AccountInformationRequestDto(accountNumber);

            when(accountRepository.findById(accountNumber)).thenReturn(Optional.empty());

            AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> accountDetailsService.fetchAccountDetails(requestDto));

            assertEquals("No account found for the given account number.", exception.getMessage());
            verify(accountRepository, times(1)).findById(accountNumber);
        }
    }

    @Nested
    @DisplayName("Tests for updateNickname")
    class UpdateNicknameTests {

        @Test
        @DisplayName("Should trim whitespace, persist changes to repository, and return response DTO when account is found")
        void updateNickname_Success() {
            Long accountNumber = 123456789012L;
            UpdateNicknameRequestDto requestDto = new UpdateNicknameRequestDto(accountNumber, "   My New Nickname   ");

            Account mockAccount = mock(Account.class);
            when(accountRepository.findById(accountNumber)).thenReturn(Optional.of(mockAccount));

            UpdateNicknameResponseDto response = accountDetailsService.updateNickname(requestDto);

            assertNotNull(response);

            verify(mockAccount, times(1)).setNickname("My New Nickname");
            verify(accountRepository, times(1)).save(mockAccount);

            when(mockAccount.getNickname()).thenReturn("My New Nickname");
            assertEquals("My New Nickname", accountDetailsService.updateNickname(requestDto).nickname());
        }

        @Test
        @DisplayName("Should throw AccountNotFoundException and bypass saving alterations when account is missing")
        void updateNickname_NotFound() {
            Long accountNumber = 999999999999L;
            UpdateNicknameRequestDto requestDto = new UpdateNicknameRequestDto(accountNumber, "New Vibe");

            when(accountRepository.findById(accountNumber)).thenReturn(Optional.empty());

            assertThrows(AccountNotFoundException.class, () -> accountDetailsService.updateNickname(requestDto));

            verify(accountRepository, never()).save(any(Account.class));
        }
    }
}

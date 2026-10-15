package com.breadwinners.service;

import com.breadwinners.dto.accountview.AccountInformationRequestDto;
import com.breadwinners.dto.accountview.AccountInformationResponseDto;
import com.breadwinners.dto.accountview.UpdateNicknameRequestDto;
import com.breadwinners.dto.accountview.UpdateNicknameResponseDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.model.Account;
import com.breadwinners.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AccountDetailsService {
    private final AccountRepository accountRepository;

    // Constructor injection to initialize required dependencies
    public AccountDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    // Fetches the account details for the account view
    public AccountInformationResponseDto fetchAccountDetails(AccountInformationRequestDto accountInformationRequestDto) {
        // Find the account and map the information to response dto, else throw error if account was not found
        return accountRepository.findById(accountInformationRequestDto.accountNumber())
                .map(
                        account -> new AccountInformationResponseDto(
                                account.getAccountNumber(),
                                account.getNickname(),
                                account.getBalance().multiply(new BigDecimal("100")).toBigInteger()
                        )
                )
                .orElseThrow(
                        () -> new AccountNotFoundException("No account found for the given account number.")
                );
    }

    // Updates the nickname of an existing account
    public UpdateNicknameResponseDto updateNickname(UpdateNicknameRequestDto updateNicknameRequestDto) {
        // Find the account
        Account account = accountRepository.findById(updateNicknameRequestDto.accountNumber())
                .orElseThrow(
                        () -> new AccountNotFoundException("No account found for the given account number.")
                );

        // Set the new nickname
        account.setNickname(updateNicknameRequestDto.nickname().trim());

        // Save the account
        accountRepository.save(account);

        // Return the new nickname
        return new UpdateNicknameResponseDto(account.getNickname());
    }
}

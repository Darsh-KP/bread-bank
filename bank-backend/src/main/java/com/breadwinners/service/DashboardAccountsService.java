package com.breadwinners.service;

import com.breadwinners.dto.dashboardaccounts.AccountSummaryResponseDto;
import com.breadwinners.dto.dashboardaccounts.AllAccountsResponseDto;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.Account;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;

@Service
public class DashboardAccountsService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public DashboardAccountsService(
            AccountRepository accountRepository,
            UserRepository userRepository
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AllAccountsResponseDto getAccountsForUser(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));

        var accounts = accountRepository.findAllByUser(user)
                .stream()
                .map(this::toAccountSummary)
                .toList();

        return new AllAccountsResponseDto(accounts);
    }

    private AccountSummaryResponseDto toAccountSummary(Account account) {
        BigInteger balanceInCents = account.getBalance()
                .movePointRight(2)
                .toBigIntegerExact();

        return new AccountSummaryResponseDto(
                account.getAccountNumber(),
                account.getAccountType().getMarketingName(),
                account.getNickname(),
                balanceInCents
        );
    }
}
package com.breadwinners.service;

import com.breadwinners.model.*;
import com.breadwinners.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountCreationService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Account createAccount(String username, String accountTypeName,
                                 String nickname, String pin) {
        AccountType acctType = accountTypeRepository
                .findByMarketingName(accountTypeName)
                .orElseThrow(() -> new IllegalArgumentException("Account type not found."));
        User user = userRepository
                .findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found."));

        Account account = new Account(acctType, user, nickname, passwordEncoder.encode(pin), null);
        return this.accountRepository.save(account);
    }

    public AccountCreationService(UserRepository userRepository,
                                  AccountRepository accountRepository,
                                  AccountTypeRepository accountTypeRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.accountTypeRepository = accountTypeRepository;
        this.passwordEncoder = passwordEncoder;
    }
}

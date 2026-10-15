package com.breadwinners.service;

import com.breadwinners.dto.accountcreation.AccountCreatedDto;
import com.breadwinners.model.*;
import com.breadwinners.repository.*;
import com.breadwinners.exception.*;
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
    public AccountCreatedDto createAccount(String username, String accountTypeName,
                                           String nickname, String pin) {
        AccountType acctType = accountTypeRepository
                .findByMarketingName(accountTypeName)
                .orElseThrow(() -> new AccountTypeNotFoundException("Account type not found."));
        User user = userRepository
                .findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found."));

        Account account = new Account(acctType, user, nickname, passwordEncoder.encode(pin), null);
        Account savedAccount = this.accountRepository.save(account);
        return new AccountCreatedDto(savedAccount.getAccountNumber());
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

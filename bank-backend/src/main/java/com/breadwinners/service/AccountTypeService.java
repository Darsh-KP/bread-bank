package com.breadwinners.service;

import com.breadwinners.model.AccountType;
import com.breadwinners.repository.AccountTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountTypeService {
    private final AccountTypeRepository accountTypeRepository;

    @Transactional
    public List<AccountType> getAllAccountTypes() {
        return accountTypeRepository.findAll();
    }

    public AccountTypeService(AccountTypeRepository accountTypeRepository) {
        this.accountTypeRepository = accountTypeRepository;
    }
}

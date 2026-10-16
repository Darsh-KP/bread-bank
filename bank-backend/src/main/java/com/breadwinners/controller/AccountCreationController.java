package com.breadwinners.controller;

import com.breadwinners.dto.accountcreation.*;
import com.breadwinners.model.AccountType;
import com.breadwinners.model.User;
import com.breadwinners.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AccountCreationController {
    private final AccountCreationService accountCreationService;
    private final AccountTypeService accountTypeService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create-account")
    public AccountCreatedDto createAccount(@AuthenticationPrincipal User user,
                                           @Valid @RequestBody CreateAccountRequestDto card) {
        return accountCreationService
                .createAccount(user.getUsername(), card.accountType(),
                        card.nickname(), card.pin());
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/account-types")
    public AccountTypeDto[] accountTypes() {
        List<AccountTypeDto> accountTypeDtos = new ArrayList<>();
        for(AccountType at : accountTypeService.getAllAccountTypes()) {
            accountTypeDtos.add(new AccountTypeDto(at.getMarketingName(), at.getInterestRate(), at.getMaturationDays()));
        }
        AccountTypeDto[] out = new AccountTypeDto[accountTypeDtos.size()];
        return accountTypeDtos.toArray(out);
    }

    public AccountCreationController(AccountCreationService acs, AccountTypeService atr) {
        this.accountCreationService = acs;
        this.accountTypeService = atr;
    }
}

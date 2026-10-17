package com.breadwinners.controller;

import com.breadwinners.dto.accountview.AccountInformationRequestDto;
import com.breadwinners.dto.accountview.AccountInformationResponseDto;
import com.breadwinners.service.AccountDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountDetailsController {
    AccountDetailsService accountDetailsService;

    // Constructor injection to initialize required dependencies
    public AccountDetailsController(AccountDetailsService accountDetailsService) {
        this.accountDetailsService = accountDetailsService;
    }

    @GetMapping()
    public ResponseEntity<AccountInformationResponseDto> fetchAccountInformation(
            @Valid @RequestBody AccountInformationRequestDto accountInformationRequestDto) {
        return ResponseEntity.status(HttpStatus.OK).body(
                accountDetailsService.fetchAccountDetails(accountInformationRequestDto)
        );
    }
}

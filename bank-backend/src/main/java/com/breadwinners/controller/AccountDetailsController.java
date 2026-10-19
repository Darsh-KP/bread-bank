package com.breadwinners.controller;

import com.breadwinners.dto.accountview.AccountInformationRequestDto;
import com.breadwinners.dto.accountview.AccountInformationResponseDto;
import com.breadwinners.dto.accountview.UpdateNicknameRequestDto;
import com.breadwinners.dto.accountview.UpdateNicknameResponseDto;
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

    // Fetches required account details for the account view page
    @GetMapping()
    public ResponseEntity<AccountInformationResponseDto> fetchAccountInformation(
            @Valid @RequestBody AccountInformationRequestDto accountInformationRequestDto
    ) {
        // Call the service and return the details
        return ResponseEntity.status(HttpStatus.OK).body(
                accountDetailsService.fetchAccountDetails(accountInformationRequestDto)
        );
    }

    // Update the nickname for the account
    @PatchMapping
    public ResponseEntity<UpdateNicknameResponseDto> modifyNickname(
            @Valid @RequestBody UpdateNicknameRequestDto updateNicknameRequestDto
    ) {
        // Call the service and update the nickname
        return ResponseEntity.status(HttpStatus.OK).body(
                accountDetailsService.updateNickname(updateNicknameRequestDto)
        );
    }
}

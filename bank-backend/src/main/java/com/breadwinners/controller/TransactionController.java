package com.breadwinners.controller;

import com.breadwinners.dto.transaction.TransactionRequestDto;
import com.breadwinners.dto.transaction.TransactionResponseDto;
import com.breadwinners.dto.transaction.VerifyPinRequestDto;
import com.breadwinners.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    // Constructor injection to initialize required dependencies
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Authenticates the provided account with its credentials
    @PostMapping("/verify-pin")
    public ResponseEntity<Void> authenticateAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VerifyPinRequestDto verifyPinRequestDto
    ) {
        // Call the service to verify PIN
        transactionService.verifyAccountPin(userDetails.getUsername(), verifyPinRequestDto);

        // Validated, return no content
        return ResponseEntity.noContent().build();
    }

    // Authenticate the account and process the deposit
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDto> depositToAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequestDto transactionRequestDto
    ) {
        // Call the service and process the deposit
        return ResponseEntity.status(HttpStatus.OK).body(
                transactionService.processDeposit(userDetails.getUsername(), transactionRequestDto)
        );
    }

    // Authenticate the account and process the withdrawal
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDto> withdrawFromAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequestDto transactionRequestDto
    ) {
        // Call the service and process the withdrawal
        return ResponseEntity.status(HttpStatus.OK).body(
                transactionService.processWithdrawal(userDetails.getUsername(), transactionRequestDto)
        );
    }
}

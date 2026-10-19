package com.breadwinners.controller;

import com.breadwinners.dto.transactionhistory.TransactionHistoryRequestDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryResponseDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.service.TransactionHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TransactionHistoryController {

    private final TransactionHistoryService transactionHistoryService;

    public TransactionHistoryController(TransactionHistoryService transactionHistoryService) {
        this.transactionHistoryService = transactionHistoryService;
    }

    @PostMapping("/transaction-history")
    public ResponseEntity<TransactionHistoryResponseDto> getHistory(
        @Valid @RequestBody TransactionHistoryRequestDto request, Authentication authentication) {
        TransactionHistoryResponseDto response = transactionHistoryService.getHistory(
                authentication.getName(), request.accountNumber(), request.limit());
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAccountNotFound(AccountNotFoundException e) {
        return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
    }
}
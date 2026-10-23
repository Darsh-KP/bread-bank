package com.breadwinners.controller;

import com.breadwinners.dto.transaction.TransactionRequestDto;
import com.breadwinners.dto.transaction.TransactionResponseDto;
import com.breadwinners.dto.transaction.VerifyPinRequestDto;
import com.breadwinners.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private static final String USERNAME = "ironman";

    @Test
    void testAuthenticateAccount_Returns204NoContent() {
        VerifyPinRequestDto request = new VerifyPinRequestDto(123456789012L, "1234");
        doNothing().when(transactionService).verifyAccountPin(USERNAME, request);

        ResponseEntity<Void> responseEntity = transactionController.authenticateAccount(USERNAME, request);

        assertNotNull(responseEntity);
        assertEquals(HttpStatus.NO_CONTENT, responseEntity.getStatusCode());
        verify(transactionService, times(1)).verifyAccountPin(USERNAME, request);
    }

    @Test
    void testDepositToAccount_Returns200AndBody() {
        TransactionRequestDto request = new TransactionRequestDto(123456789012L, "1234", new BigInteger("5000"), "Deposit");
        TransactionResponseDto mockResponse = mock(TransactionResponseDto.class);

        when(transactionService.processDeposit(USERNAME, request)).thenReturn(mockResponse);

        ResponseEntity<TransactionResponseDto> responseEntity = transactionController.depositToAccount(USERNAME, request);

        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(mockResponse, responseEntity.getBody());
    }

    @Test
    void testWithdrawFromAccount_Returns200AndBody() {
        TransactionRequestDto request = new TransactionRequestDto(123456789012L, "1234", new BigInteger("2000"), "Withdraw");
        TransactionResponseDto mockResponse = mock(TransactionResponseDto.class);

        when(transactionService.processWithdrawal(USERNAME, request)).thenReturn(mockResponse);

        ResponseEntity<TransactionResponseDto> responseEntity = transactionController.withdrawFromAccount(USERNAME, request);

        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(mockResponse, responseEntity.getBody());
    }
}

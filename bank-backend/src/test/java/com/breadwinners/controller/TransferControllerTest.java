
package com.breadwinners.controller;

import com.breadwinners.dto.transfer.TransferRequestDto;
import com.breadwinners.dto.transfer.TransferResponseDto;
import com.breadwinners.service.TransferService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferControllerTest {

    @Mock
    private TransferService transferService;

    @InjectMocks
    private TransferController transferController;

    @Test
    void successfulTransferReturnsOkResponse() {
        String username = "testuser";

        TransferRequestDto request = new TransferRequestDto(
                123456789012L,
                987654321098L,
                BigInteger.valueOf(10000)
        );

        TransferResponseDto expectedResponse =
                new TransferResponseDto(true, BigInteger.valueOf(10000));

        when(transferService.transfer(username, request))
                .thenReturn(expectedResponse);

        ResponseEntity<TransferResponseDto> response =
                transferController.transfer(username, request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(expectedResponse, response.getBody());

        verify(transferService).transfer(username, request);
    }

    @Test
    void transferDelegatesCorrectRequestToService() {
        String username = "testuser";

        TransferRequestDto request = new TransferRequestDto(
                123456789012L,
                987654321098L,
                BigInteger.valueOf(2500)
        );

        TransferResponseDto expectedResponse =
                new TransferResponseDto(true, BigInteger.valueOf(2500));

        when(transferService.transfer(username, request))
                .thenReturn(expectedResponse);

        transferController.transfer(username, request);

        verify(transferService, times(1))
                .transfer(username, request);
    }
}

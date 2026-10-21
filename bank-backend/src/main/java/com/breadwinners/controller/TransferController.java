
package com.breadwinners.controller;

import com.breadwinners.dto.transfer.TransferRequestDto;
import com.breadwinners.dto.transfer.TransferResponseDto;
import com.breadwinners.service.TransferService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<TransferResponseDto> transfer(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody TransferRequestDto request) {

        return ResponseEntity.ok(
                transferService.transfer(username, request)
        );
    }
}

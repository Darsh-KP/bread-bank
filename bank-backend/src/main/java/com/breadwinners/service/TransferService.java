
package com.breadwinners.service;

import com.breadwinners.dto.transfer.TransferRequestDto;
import com.breadwinners.dto.transfer.TransferResponseDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.exception.InvalidTransferException;
import com.breadwinners.model.Account;
import com.breadwinners.model.User;
import com.breadwinners.repository.AccountRepository;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.security.JwtUtil;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public TransferService(AccountRepository accountRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public TransferResponseDto transfer(String token, TransferRequestDto request) {

        if (request.fromAccountNumber().equals(request.toAccountNumber())) {
            throw new InvalidTransferException("Cannot transfer to the same account.");
        }

        String username = jwtUtil.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        Account source = accountRepository
                .findByAccountNumberAndUser(request.fromAccountNumber(), user)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Source account not found or does not belong to the user."
                ));

        Account destination = accountRepository.findById(request.toAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException(
                        "Destination account not found."
                ));

        BigDecimal amount = new BigDecimal(request.amountInCents())
                .movePointLeft(2);

        if (source.getBalance().compareTo(amount) < 0) {
            throw new InvalidTransferException("Insufficient funds.");
        }

        source.setBalance(source.getBalance().subtract(amount));
        destination.setBalance(destination.getBalance().add(amount));

        accountRepository.save(source);
        accountRepository.save(destination);

        return new TransferResponseDto(true, request.amountInCents());
    }
}

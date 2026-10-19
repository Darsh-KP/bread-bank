package com.breadwinners.exception;

import com.breadwinners.dto.GenericMessageResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handle auth exceptions
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<GenericMessageResponseDTO> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body(
                new GenericMessageResponseDTO(e.getMessage())
        );
    }

    @ExceptionHandler({
            DuplicateEmailException.class,
            DuplicatePhoneException.class,
            DuplicateUserException.class
    })
    public ResponseEntity<GenericMessageResponseDTO> handleDuplicateException(Exception e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new GenericMessageResponseDTO(e.getMessage())
        );
    }

    // Handle transaction failure exceptions
    @ExceptionHandler({
            BalanceExceededException.class,
            InsufficientBalanceException.class
    })
    public ResponseEntity<GenericMessageResponseDTO> handleTransactionException(Exception e) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(
                new GenericMessageResponseDTO(e.getMessage())
        );
    }

    // Handle service exceptions (custom)
    @ExceptionHandler({
            AccountNotFoundException.class,
            AccountTypeNotFoundException.class,
            InvalidPhoneFormatException.class,
            InvalidRefreshTokenException.class,
            InvalidRegistrationException.class,
            ReusedPasswordException.class,
            UserNotFoundException.class
    })
    public ResponseEntity<GenericMessageResponseDTO> handleServiceException(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new GenericMessageResponseDTO(e.getMessage())
        );
    }

    // Jakarta validation handler (DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GenericMessageResponseDTO> handleDtoValidationException(MethodArgumentNotValidException e) {
        String errors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new GenericMessageResponseDTO("Invalid request - " + errors)
        );
    }

    // Model constructor handler
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<GenericMessageResponseDTO> handleModelConstructorException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new GenericMessageResponseDTO("Illegal state error occurred. Please notify technical support.")
        );
    }

    // Catch-all for any unhandled exceptions across application
    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericMessageResponseDTO> handleCatchAll(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new GenericMessageResponseDTO("An unexpected internal server error occurred.")
        );
    }
}

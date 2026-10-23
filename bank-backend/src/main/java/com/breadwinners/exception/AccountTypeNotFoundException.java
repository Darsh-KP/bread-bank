package com.breadwinners.exception;

public class AccountTypeNotFoundException extends RuntimeException {
    public AccountTypeNotFoundException(String message) {
        super(message);
    }
}
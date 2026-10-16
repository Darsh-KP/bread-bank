package com.breadwinners.exception;

public class ReusedPasswordException extends RuntimeException {
    public ReusedPasswordException(String message) {
        super(message);
    }
}

package com.breadwinners.exception;

public class BalanceExceededException extends RuntimeException {
    public BalanceExceededException(String message) {
        super(message);
    }
}

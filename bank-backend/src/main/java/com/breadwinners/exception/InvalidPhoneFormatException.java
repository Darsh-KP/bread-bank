package com.breadwinners.exception;

public class InvalidPhoneFormatException extends RuntimeException {
    public InvalidPhoneFormatException(String message) {
        super(message);
    }
}

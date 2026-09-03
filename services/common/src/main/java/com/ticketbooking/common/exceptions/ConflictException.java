package com.ticketbooking.common.exceptions;
public class ConflictException extends RuntimeException {
    private final String errorCode;
    public ConflictException(String msg) { super(msg); this.errorCode = "CONFLICT"; }
    public ConflictException(String msg, String code) { super(msg); this.errorCode = code; }
    public String getErrorCode() { return errorCode; }
}

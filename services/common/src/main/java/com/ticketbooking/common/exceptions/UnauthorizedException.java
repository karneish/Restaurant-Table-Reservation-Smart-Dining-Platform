package com.ticketbooking.common.exceptions;
public class UnauthorizedException extends RuntimeException {
    private final String errorCode;
    public UnauthorizedException(String msg) { super(msg); this.errorCode = "UNAUTHORIZED"; }
    public UnauthorizedException(String msg, String code) { super(msg); this.errorCode = code; }
    public String getErrorCode() { return errorCode; }
}

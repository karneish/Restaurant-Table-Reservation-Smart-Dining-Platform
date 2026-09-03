package com.ticketbooking.common.enums;
public enum PaymentStatus {
    PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED;
    public boolean isTerminal() { return this == COMPLETED || this == FAILED || this == REFUNDED; }
}

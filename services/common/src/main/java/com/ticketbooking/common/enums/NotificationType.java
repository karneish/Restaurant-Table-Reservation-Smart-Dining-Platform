package com.ticketbooking.common.enums;
public enum NotificationType {
    RESERVATION_CONFIRMED, RESERVATION_CANCELLED, RESERVATION_REMINDER,
    WAITLIST_AVAILABLE, PAYMENT_RECEIVED, PAYMENT_FAILED,
    PREORDER_STATUS_UPDATE, TABLE_READY, FEEDBACK_REQUEST, SYSTEM_ALERT;
    public String getDefaultTitle() {
        return switch (this) {
            case RESERVATION_CONFIRMED -> "Reservation Confirmed";
            case RESERVATION_CANCELLED -> "Reservation Cancelled";
            case WAITLIST_AVAILABLE -> "Table Available";
            case PAYMENT_RECEIVED -> "Payment Received";
            case TABLE_READY -> "Your Table is Ready";
            default -> "Notification";
        };
    }
}

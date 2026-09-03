package com.ticketbooking.common.enums;
public enum ReservationStatus {
    HOLD, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW;
    public boolean canTransitionTo(ReservationStatus next) {
        return switch (this) {
            case HOLD -> next == CONFIRMED || next == CANCELLED;
            case CONFIRMED -> next == SEATED || next == CANCELLED || next == NO_SHOW;
            case SEATED -> next == COMPLETED;
            case COMPLETED, CANCELLED, NO_SHOW -> false;
        };
    }
}

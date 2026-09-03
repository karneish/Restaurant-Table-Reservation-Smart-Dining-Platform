package com.ticketbooking.common.enums;
public enum CleaningStatus {
    READY, DIRTY, CLEANING;
    public boolean canTransitionTo(CleaningStatus next) {
        return switch (this) { case READY -> next == DIRTY; case DIRTY -> next == CLEANING; case CLEANING -> next == READY; };
    }
}

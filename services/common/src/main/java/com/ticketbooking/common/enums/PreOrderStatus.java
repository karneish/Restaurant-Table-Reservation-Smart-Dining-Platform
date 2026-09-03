package com.ticketbooking.common.enums;
public enum PreOrderStatus {
    DRAFT, PLACED, IN_PREP, SERVED;
    public boolean canTransitionTo(PreOrderStatus next) {
        return switch (this) { case DRAFT -> next == PLACED; case PLACED -> next == IN_PREP; case IN_PREP -> next == SERVED; case SERVED -> false; };
    }
}

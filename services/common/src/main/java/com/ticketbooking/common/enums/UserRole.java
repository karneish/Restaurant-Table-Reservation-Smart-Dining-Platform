package com.ticketbooking.common.enums;
public enum UserRole {
    GUEST, CUSTOMER, STAFF, MANAGER, ADMIN;
    public boolean hasPermission(UserRole required) { return this.ordinal() >= required.ordinal(); }
    public boolean isAdmin() { return this == ADMIN || this == MANAGER; }
}

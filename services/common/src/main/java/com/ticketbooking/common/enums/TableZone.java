package com.ticketbooking.common.enums;
public enum TableZone {
    INDOOR("Indoor Seating"), OUTDOOR("Outdoor/Patio"), BAR("Bar Area"),
    VIP("VIP Section"), PRIVATE("Private Dining"), WINDOW("Window Side");
    private final String displayName;
    TableZone(String dn) { this.displayName = dn; }
    public String getDisplayName() { return displayName; }
}

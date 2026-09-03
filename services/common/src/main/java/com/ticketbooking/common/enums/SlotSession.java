package com.ticketbooking.common.enums;
public enum SlotSession {
    BREAKFAST("07:00","11:00"), LUNCH("11:30","15:00"), EVENING("15:00","18:00"),
    DINNER("18:30","22:00"), LATE_NIGHT("22:00","23:59");
    private final String defaultStart, defaultEnd;
    SlotSession(String s, String e) { this.defaultStart = s; this.defaultEnd = e; }
    public String getDefaultStart() { return defaultStart; }
    public String getDefaultEnd() { return defaultEnd; }
    public static SlotSession fromTime(String time) {
        int h = Integer.parseInt(time.split(":")[0]);
        if (h < 11) return BREAKFAST; if (h < 15) return LUNCH;
        if (h < 18) return EVENING; if (h < 22) return DINNER; return LATE_NIGHT;
    }
}

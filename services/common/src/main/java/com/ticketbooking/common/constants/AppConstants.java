package com.ticketbooking.common.constants;
public final class AppConstants {
    private AppConstants() {}
    public static final String GUEST_EMAIL = "guest@tablehub.com";
    public static final String HEADER_USER_EMAIL = "X-User-Email";
    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final int HOLD_EXPIRY_MINUTES = 15;
    public static final int PARTY_SIZE_MIN = 1;
    public static final int PARTY_SIZE_MAX = 20;
    public static final int RATING_MIN = 1;
    public static final int RATING_MAX = 5;
    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 10;
    public static final int JWT_ACCESS_EXPIRY_MINUTES = 30;
    public static final int JWT_REFRESH_EXPIRY_DAYS = 7;
}

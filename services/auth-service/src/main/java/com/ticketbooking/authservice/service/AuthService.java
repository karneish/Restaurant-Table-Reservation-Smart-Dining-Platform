package com.ticketbooking.authservice.service;

import com.ticketbooking.common.dto.LoginRequest;
import com.ticketbooking.common.dto.RegisterRequest;
import com.ticketbooking.common.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
}

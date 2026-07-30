package com.ticketbooking.authservice.controller;

import com.ticketbooking.common.dto.LoginRequest;
import com.ticketbooking.common.dto.RegisterRequest;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.common.response.AuthResponse;
import com.ticketbooking.authservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<APIResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<APIResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(APIResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<APIResponse<AuthResponse>> refresh(@RequestBody Map<String, String> request) {
        AuthResponse response = authService.refreshToken(request.get("refreshToken"));
        return ResponseEntity.ok(APIResponse.success("Token refreshed", response));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP for email verification")
    public ResponseEntity<APIResponse<Void>> sendOtp(@RequestBody Map<String, String> request) {
        authService.sendOtp(request.get("email"));
        return ResponseEntity.ok(APIResponse.success("OTP sent successfully", null));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<APIResponse<Boolean>> verifyOtp(@RequestBody Map<String, String> request) {
        boolean verified = authService.verifyOtp(request.get("email"), request.get("otp"));
        return ResponseEntity.ok(APIResponse.success("OTP verification " + (verified ? "successful" : "failed"), verified));
    }
}

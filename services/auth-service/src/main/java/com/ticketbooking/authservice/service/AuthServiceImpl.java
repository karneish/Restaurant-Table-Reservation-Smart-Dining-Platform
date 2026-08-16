package com.ticketbooking.authservice.service;

import com.ticketbooking.authservice.client.NotificationServiceClient;
import com.ticketbooking.authservice.client.UserServiceClient;
import com.ticketbooking.authservice.entity.Role;
import com.ticketbooking.authservice.entity.User;
import com.ticketbooking.authservice.repository.UserRepository;
import com.ticketbooking.authservice.security.JwtTokenProvider;
import com.ticketbooking.common.dto.LoginRequest;
import com.ticketbooking.common.dto.RegisterRequest;
import com.ticketbooking.common.exception.BookingException;
import com.ticketbooking.common.exception.InvalidCredentialsException;
import com.ticketbooking.common.response.AuthResponse;
import com.ticketbooking.common.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Duration OTP_VALIDITY = Duration.ofMinutes(5);
    private static final Duration OTP_RESEND_GAP = Duration.ofSeconds(60);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserServiceClient userServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidCredentialsException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .role(Role.CUSTOMER)
                .emailVerified(false)
                .build();
        user = userRepository.save(user);

        // Sync the profile into user-service so the profile page works.
        userServiceClient.createProfile(user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getAddress(), user.getRole().name());

        // Auto-issue an OTP on registration.
        issueOtp(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("User registered successfully: {}", user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .message("Registration successful. Please verify your email with the OTP.")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("User logged in: {}", user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .message("Login successful")
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidCredentialsException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        String newToken = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .message("Token refreshed successfully")
                .build();
    }

    @Override
    @Transactional
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        if (user.getLastOtpSentAt() != null
                && Duration.between(user.getLastOtpSentAt(), LocalDateTime.now()).getSeconds() < OTP_RESEND_GAP.getSeconds()) {
            throw new BookingException("OTP was sent recently. Please wait before requesting another.");
        }

        issueOtp(user);
    }

    private void issueOtp(User user) {
        String otp = IdGenerator.generateOtp();
        user.setOtp(null);
        user.setOtpHash(hashOtp(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plus(OTP_VALIDITY));
        user.setLastOtpSentAt(LocalDateTime.now());
        userRepository.save(user);
        notificationServiceClient.sendOtp(user.getEmail(), otp);
        log.info("OTP issued for {}", user.getEmail());
    }

    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        if (user.getOtpHash() == null || user.getOtpExpiresAt() == null) {
            throw new BookingException("No OTP was requested for this email");
        }
        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BookingException("OTP has expired. Please request a new one.");
        }
        if (!user.getOtpHash().equals(hashOtp(otp))) {
            throw new BookingException("Invalid OTP code");
        }

        user.setEmailVerified(true);
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);
        return true;
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}

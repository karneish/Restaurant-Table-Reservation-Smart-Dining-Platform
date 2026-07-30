package com.ticketbooking.authservice.config;

import com.ticketbooking.authservice.entity.Role;
import com.ticketbooking.authservice.entity.User;
import com.ticketbooking.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Auth DB already seeded.");
            return;
        }

        userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@ticketbooking.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9876543210")
                .address("Mumbai, Maharashtra")
                .role(Role.ADMIN)
                .emailVerified(true)
                .build());

        userRepository.save(User.builder()
                .name("John Doe")
                .email("john@example.com")
                .password(passwordEncoder.encode("pass123"))
                .phone("9876543211")
                .address("Delhi, India")
                .role(Role.CUSTOMER)
                .emailVerified(true)
                .build());

        log.info("Auth DB seeded with admin and customer users");
    }
}

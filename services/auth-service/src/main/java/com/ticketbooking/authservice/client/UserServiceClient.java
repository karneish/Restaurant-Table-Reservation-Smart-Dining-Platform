package com.ticketbooking.authservice.client;

import com.ticketbooking.common.dto.UserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;

@Slf4j
@Component
public class UserServiceClient {

    private final WebClient webClient;

    public UserServiceClient(@Value("${USER_SERVICE_URL:http://localhost:8082}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    public void createProfile(Long id, String name, String email, String phone, String address, String role) {
        try {
            UserDTO dto = UserDTO.builder()
                    .id(id)
                    .name(name)
                    .email(email)
                    .phone(phone)
                    .address(address)
                    .role(role)
                    .build();
            webClient.post()
                    .uri("/api/users")
                    .bodyValue(dto)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            log.info("Profile synced to user-service for {}", email);
        } catch (Exception e) {
            log.warn("Could not sync profile to user-service for {}: {}", email, e.getMessage());
        }
    }

    public void syncProfile(Long id, String name, String phone, String address) {
        try {
            LinkedHashMap<String, Object> body = new LinkedHashMap<>();
            body.put("name", name);
            body.put("phone", phone);
            body.put("address", address);
            webClient.put()
                    .uri("/api/users/{id}", id)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Could not sync profile update for user {}: {}", id, e.getMessage());
        }
    }
}

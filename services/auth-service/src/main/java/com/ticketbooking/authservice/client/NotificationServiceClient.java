package com.ticketbooking.authservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Component
public class NotificationServiceClient {

    private final WebClient webClient;

    public NotificationServiceClient(@Value("${NOTIFICATION_SERVICE_URL:http://localhost:8088}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    public void sendOtp(String email, String otp) {
        try {
            webClient.post()
                    .uri("/api/notifications/send-otp")
                    .bodyValue(Map.of("email", email, "otp", otp))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Could not send OTP notification to {}: {}", email, e.getMessage());
        }
    }
}

package com.ticketbooking.reservationservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
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

    public void sendNotification(String userEmail, String type, String title, String body) {
        try {
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("userEmail", userEmail);
            payload.put("type", type);
            payload.put("title", title);
            payload.put("body", body);
            webClient.post()
                    .uri("/api/notifications/push")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Could not push notification to {}: {}", userEmail, e.getMessage());
        }
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            Map<String, String> payload = new LinkedHashMap<>();
            payload.put("to", to);
            payload.put("subject", subject);
            payload.put("body", body);
            webClient.post()
                    .uri("/api/notifications/waitlist")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Could not send waitlist email to {}: {}", to, e.getMessage());
        }
    }
}

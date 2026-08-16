package com.ticketbooking.reservationservice.client;

import com.ticketbooking.common.dto.MenuItemDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.LinkedHashMap;

@Slf4j
@Component
public class MenuServiceClient {

    private final WebClient webClient;

    public MenuServiceClient(@Value("${RESTAURANT_SERVICE_URL:http://localhost:8083}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    @CircuitBreaker(name = "restaurantService", fallbackMethod = "fallbackGetMenuItem")
    public MenuItemDTO getMenuItem(Long restaurantId, Long itemId) {
        try {
            return webClient.get()
                    .uri("/api/restaurants/{restaurantId}/menu/{itemId}", restaurantId, itemId)
                    .retrieve()
                    .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                    .map(response -> {
                        if (response != null && response.isSuccess() && response.getData() instanceof LinkedHashMap<?, ?> map) {
                            @SuppressWarnings("unchecked")
                            LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>) map;
                            return MenuItemDTO.builder()
                                    .id(m.get("id") != null ? ((Number) m.get("id")).longValue() : null)
                                    .restaurantId(m.get("restaurantId") != null ? ((Number) m.get("restaurantId")).longValue() : null)
                                    .name((String) m.get("name"))
                                    .category((String) m.get("category"))
                                    .price(m.get("price") != null ? new BigDecimal(m.get("price").toString()) : null)
                                    .dietaryTags((String) m.get("dietaryTags"))
                                    .build();
                        }
                        return null;
                    })
                    .block();
        } catch (Exception e) {
            return fallbackGetMenuItem(restaurantId, itemId, e);
        }
    }

    public MenuItemDTO fallbackGetMenuItem(Long restaurantId, Long itemId, Throwable t) {
        log.warn("Restaurant service is down. Cannot fetch menu item for id: {}", itemId);
        return null;
    }
}

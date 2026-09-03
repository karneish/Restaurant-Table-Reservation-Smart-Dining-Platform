package com.ticketbooking.reservationservice.client;

import com.ticketbooking.common.dto.RestaurantDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;

@Slf4j
@Component
public class RestaurantServiceClient {

    private final WebClient webClient;

    public RestaurantServiceClient(@Value("${RESTAURANT_SERVICE_URL:http://localhost:8083}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    @CircuitBreaker(name = "restaurantService", fallbackMethod = "fallbackGetRestaurant")
    public RestaurantDTO getRestaurantById(Long restaurantId) {
        try {
            return webClient.get()
                    .uri("/api/restaurants/{id}", restaurantId)
                    .retrieve()
                    .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                    .map(response -> {
                        if (response != null && response.isSuccess() && response.getData() instanceof LinkedHashMap<?, ?> map) {
                            @SuppressWarnings("unchecked")
                            LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>) map;
                            return RestaurantDTO.builder()
                                    .id(m.get("id") != null ? ((Number) m.get("id")).longValue() : null)
                                    .name((String) m.get("name"))
                                    .city((String) m.get("city"))
                                    .build();
                        }
                        return null;
                    })
                    .block();
        } catch (Exception e) {
            return fallbackGetRestaurant(restaurantId, e);
        }
    }

    public RestaurantDTO fallbackGetRestaurant(Long restaurantId, Throwable t) {
        log.warn("Restaurant service is down. Cannot fetch restaurant details for id: {}", restaurantId);
        return null;
    }

    @CircuitBreaker(name = "restaurantService", fallbackMethod = "fallbackUpdateRating")
    public void updateRating(Long restaurantId, Double rating) {
        try {
            java.util.Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("rating", rating);
            webClient.put()
                    .uri("/api/restaurants/{id}/rating", restaurantId)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            fallbackUpdateRating(restaurantId, rating, e);
        }
    }

    public void fallbackUpdateRating(Long restaurantId, Double rating, Throwable t) {
        log.warn("Could not sync aggregated rating {} for restaurant {}: {}", rating, restaurantId, t.getMessage());
    }
}

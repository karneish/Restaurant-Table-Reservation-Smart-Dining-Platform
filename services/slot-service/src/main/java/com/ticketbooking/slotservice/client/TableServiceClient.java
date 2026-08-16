package com.ticketbooking.slotservice.client;

import com.ticketbooking.common.dto.RestaurantTableDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;

@Slf4j
@Component
public class TableServiceClient {

    private final WebClient webClient;

    public TableServiceClient(@Value("${TABLE_SERVICE_URL:http://localhost:8084}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    @CircuitBreaker(name = "tableService", fallbackMethod = "fallbackGetTable")
    public RestaurantTableDTO getTableById(Long tableId) {
        try {
            return webClient.get()
                    .uri("/api/tables/{id}", tableId)
                    .retrieve()
                    .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                    .map(response -> {
                        if (response != null && response.isSuccess()) {
                            Object data = response.getData();
                            if (data instanceof LinkedHashMap<?, ?> map) {
                                @SuppressWarnings("unchecked")
                                LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>) map;
                                return RestaurantTableDTO.builder()
                                        .id(m.get("id") != null ? ((Number) m.get("id")).longValue() : null)
                                        .areaId(m.get("areaId") != null ? ((Number) m.get("areaId")).longValue() : null)
                                        .restaurantId(m.get("restaurantId") != null ? ((Number) m.get("restaurantId")).longValue() : null)
                                        .tableNumber((String) m.get("tableNumber"))
                                        .capacity(m.get("capacity") != null ? ((Number) m.get("capacity")).intValue() : null)
                                        .zone((String) m.get("zone"))
                                        .cleaningStatus((String) m.get("cleaningStatus"))
                                        .cleaningEtaMinutes(m.get("cleaningEtaMinutes") != null ? ((Number) m.get("cleaningEtaMinutes")).intValue() : null)
                                        .build();
                            }
                        }
                        return null;
                    })
                    .block();
        } catch (Exception e) {
            return fallbackGetTable(tableId, e);
        }
    }

    public RestaurantTableDTO fallbackGetTable(Long tableId, Throwable t) {
        log.warn("Table service is down. Cannot fetch table details for id: {}", tableId);
        return null;
    }
}

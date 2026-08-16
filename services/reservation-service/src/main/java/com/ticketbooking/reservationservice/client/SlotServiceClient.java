package com.ticketbooking.reservationservice.client;

import com.ticketbooking.common.dto.TableSlotDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class SlotServiceClient {

    private final WebClient webClient;

    public SlotServiceClient(@Value("${SLOT_SERVICE_URL:http://localhost:8085}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    @CircuitBreaker(name = "slotService", fallbackMethod = "fallbackGetSlot")
    public TableSlotDTO getSlotById(Long slotId) {
        try {
            return webClient.get()
                    .uri("/api/slots/{id}", slotId)
                    .retrieve()
                    .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                    .map(response -> {
                        if (response != null && response.isSuccess() && response.getData() instanceof LinkedHashMap<?, ?> map) {
                            @SuppressWarnings("unchecked")
                            LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>) map;
                            return TableSlotDTO.builder()
                                    .id(m.get("id") != null ? ((Number) m.get("id")).longValue() : null)
                                    .tableId(m.get("tableId") != null ? ((Number) m.get("tableId")).longValue() : null)
                                    .restaurantId(m.get("restaurantId") != null ? ((Number) m.get("restaurantId")).longValue() : null)
                                    .slotDate(m.get("slotDate") != null ? java.time.LocalDate.parse((String) m.get("slotDate")) : null)
                                    .startTime(m.get("startTime") != null ? java.time.LocalTime.parse((String) m.get("startTime")) : null)
                                    .endTime(m.get("endTime") != null ? java.time.LocalTime.parse((String) m.get("endTime")) : null)
                                    .sessionName((String) m.get("sessionName"))
                                    .status((String) m.get("status"))
                                    .build();
                        }
                        return null;
                    })
                    .block();
        } catch (Exception e) {
            return fallbackGetSlot(slotId, e);
        }
    }

    public TableSlotDTO fallbackGetSlot(Long slotId, Throwable t) {
        log.warn("Slot service is down. Cannot fetch slot details for id: {}", slotId);
        return null;
    }

    public void updateSlotStatus(Long slotId, String status) {
        try {
            webClient.put()
                    .uri("/api/slots/{id}/status", slotId)
                    .bodyValue(Map.of("status", status))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Failed to update slot {} status to {}", slotId, status);
        }
    }
}

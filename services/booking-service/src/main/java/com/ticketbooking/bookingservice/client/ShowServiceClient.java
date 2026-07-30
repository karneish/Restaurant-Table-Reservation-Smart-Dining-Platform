package com.ticketbooking.bookingservice.client;

import com.ticketbooking.common.dto.ShowDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Component
public class ShowServiceClient {

    private final WebClient webClient;

    public ShowServiceClient() {
        this.webClient = WebClient.builder().baseUrl("http://localhost:8085").build();
    }

    @CircuitBreaker(name = "showService", fallbackMethod = "fallbackGetShow")
    public ShowDTO getShowById(Long showId) {
        return webClient.get()
                .uri("/api/shows/{id}", showId)
                .retrieve()
                .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                .map(response -> {
                    if (response != null && response.isSuccess()) {
                        Object data = response.getData();
                        if (data instanceof java.util.LinkedHashMap map) {
                            return convertToShowDTO(map);
                        }
                    }
                    return null;
                })
                .block();
    }

    public ShowDTO fallbackGetShow(Long showId, Throwable t) {
        log.warn("Show service is down. Cannot fetch show details for id: {}", showId);
        return null;
    }

    @SuppressWarnings("unchecked")
    private ShowDTO convertToShowDTO(java.util.LinkedHashMap<String, Object> map) {
        if (map == null) return null;
        return ShowDTO.builder()
                .id(map.get("id") != null ? ((Number) map.get("id")).longValue() : null)
                .movieId(map.get("movieId") != null ? ((Number) map.get("movieId")).longValue() : null)
                .screenId(map.get("screenId") != null ? ((Number) map.get("screenId")).longValue() : null)
                .theatreId(map.get("theatreId") != null ? ((Number) map.get("theatreId")).longValue() : null)
                .showDate(map.get("showDate") != null ? java.time.LocalDate.parse((String) map.get("showDate")) : null)
                .showTime(map.get("showTime") != null ? java.time.LocalTime.parse((String) map.get("showTime")) : null)
                .ticketPrice(map.get("ticketPrice") != null ? new java.math.BigDecimal(map.get("ticketPrice").toString()) : null)
                .availableSeats(map.get("availableSeats") != null ? ((Number) map.get("availableSeats")).intValue() : null)
                .status((String) map.get("status"))
                .build();
    }
}

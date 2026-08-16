package com.ticketbooking.reservationservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketbooking.common.dto.ReservationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationEventPublisher {

    private final ObjectMapper objectMapper;
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        String key = String.valueOf(System.nanoTime());
        emitters.put(key, emitter);
        emitter.onCompletion(() -> emitters.remove(key));
        emitter.onTimeout(() -> emitters.remove(key));
        emitter.onError(e -> emitters.remove(key));
        try {
            emitter.send(SseEmitter.event().name("connected").data("{}"));
        } catch (IOException e) {
            emitters.remove(key);
        }
        return emitter;
    }

    public void publish(String type, Object payload) {
        String json;
        try {
            json = objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            log.warn("Could not serialize SSE payload: {}", e.getMessage());
            return;
        }
        emitters.forEach((key, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name(type).data(json));
            } catch (IOException | IllegalStateException e) {
                emitter.complete();
                emitters.remove(key);
            }
        });
    }

    public void publishReservation(ReservationDTO dto) {
        publish("reservation", dto);
    }
}

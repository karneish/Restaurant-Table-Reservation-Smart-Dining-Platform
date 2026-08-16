package com.ticketbooking.apigateway.config;

import com.ticketbooking.common.response.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class FallbackController {

    @GetMapping("/fallback/auth")
    public Mono<ResponseEntity<APIResponse<Void>>> authFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Auth service is temporarily unavailable. Please try again later.")));
    }

    @GetMapping("/fallback/user")
    public Mono<ResponseEntity<APIResponse<Void>>> userFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("User service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/restaurant")
    public Mono<ResponseEntity<APIResponse<Void>>> restaurantFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Restaurant service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/table")
    public Mono<ResponseEntity<APIResponse<Void>>> tableFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Table service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/slot")
    public Mono<ResponseEntity<APIResponse<Void>>> slotFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Slot service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/reservation")
    public Mono<ResponseEntity<APIResponse<Void>>> reservationFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Reservation service is temporarily unavailable. Please try again later.")));
    }

    @GetMapping("/fallback/payment")
    public Mono<ResponseEntity<APIResponse<Void>>> paymentFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Payment service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/notification")
    public Mono<ResponseEntity<APIResponse<Void>>> notificationFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Notification service is temporarily unavailable.")));
    }
}
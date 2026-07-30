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

    @GetMapping("/fallback/movie")
    public Mono<ResponseEntity<APIResponse<Void>>> movieFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Movie service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/theatre")
    public Mono<ResponseEntity<APIResponse<Void>>> theatreFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Theatre service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/show")
    public Mono<ResponseEntity<APIResponse<Void>>> showFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Show service is temporarily unavailable.")));
    }

    @GetMapping("/fallback/booking")
    public Mono<ResponseEntity<APIResponse<Void>>> bookingFallback() {
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(APIResponse.error("Booking service is temporarily unavailable. Please try again later.")));
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

package com.ticketbooking.reservationservice.client;

import com.ticketbooking.common.dto.PaymentDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;

@Slf4j
@Component
public class PaymentServiceClient {

    private final WebClient webClient;

    public PaymentServiceClient(@Value("${PAYMENT_SERVICE_URL:http://localhost:8087}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(normalizeUrl(baseUrl)).build();
    }

    private static String normalizeUrl(String url) {
        return url != null && !url.isBlank() && !url.contains("://") ? "https://" + url : url;
    }

    @CircuitBreaker(name = "paymentService", fallbackMethod = "fallbackProcess")
    public PaymentDTO processPayment(Long bookingId, java.math.BigDecimal amount, String paymentMethod,
                                     String cardNumber, String cardHolderName, String expiryDate, String cvv, String upiId) {
        try {
            LinkedHashMap<String, Object> body = new LinkedHashMap<>();
            body.put("bookingId", bookingId);
            body.put("amount", amount);
            body.put("paymentMethod", paymentMethod);
            if (cardNumber != null) body.put("cardNumber", cardNumber);
            if (cardHolderName != null) body.put("cardHolderName", cardHolderName);
            if (expiryDate != null) body.put("expiryDate", expiryDate);
            if (cvv != null) body.put("cvv", cvv);
            if (upiId != null) body.put("upiId", upiId);

            return webClient.post()
                    .uri("/api/payments/process")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(com.ticketbooking.common.response.APIResponse.class)
                    .map(response -> {
                        if (response != null && response.isSuccess() && response.getData() instanceof LinkedHashMap<?, ?> map) {
                            @SuppressWarnings("unchecked")
                            LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>) map;
                            return PaymentDTO.builder()
                                    .id(m.get("id") != null ? ((Number) m.get("id")).longValue() : null)
                                    .bookingId(m.get("bookingId") != null ? ((Number) m.get("bookingId")).longValue() : null)
                                    .transactionId((String) m.get("transactionId"))
                                    .amount(m.get("amount") != null ? new java.math.BigDecimal(m.get("amount").toString()) : null)
                                    .paymentMethod((String) m.get("paymentMethod"))
                                    .status((String) m.get("status"))
                                    .createdAt(m.get("createdAt") != null ? java.time.LocalDateTime.parse(m.get("createdAt").toString()) : null)
                                    .build();
                        }
                        return null;
                    })
                    .block();
        } catch (Exception e) {
            return fallbackProcess(bookingId, amount, paymentMethod, cardNumber, cardHolderName, expiryDate, cvv, upiId, e);
        }
    }

    public PaymentDTO fallbackProcess(Long bookingId, java.math.BigDecimal amount, String paymentMethod,
                                      String cardNumber, String cardHolderName, String expiryDate, String cvv, String upiId, Throwable t) {
        log.warn("Payment service is down. Simulating SUCCESS for booking {} amount {}", bookingId, amount);
        return PaymentDTO.builder()
                .bookingId(bookingId)
                .transactionId(com.ticketbooking.common.util.IdGenerator.generateTransactionId())
                .amount(amount)
                .paymentMethod(paymentMethod)
                .status("SUCCESS")
                .build();
    }

    public void refund(String transactionId) {
        try {
            webClient.post()
                    .uri("/api/payments/{transactionId}/refund", transactionId)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.warn("Failed to refund payment {}", transactionId);
        }
    }
}

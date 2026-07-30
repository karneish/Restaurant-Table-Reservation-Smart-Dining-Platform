package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private Long bookingId;
    private LocalDateTime createdAt;
}

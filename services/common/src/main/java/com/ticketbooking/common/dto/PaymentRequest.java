package com.ticketbooking.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class PaymentRequest {
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String upiId;
}

package com.ticketbooking.paymentservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
public class PaymentGatewayRequest {
    @NotNull private Long bookingId;
    @NotNull @Min(1) private BigDecimal amount;
    @NotBlank private String paymentMethod;
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
    private String upiId;
}

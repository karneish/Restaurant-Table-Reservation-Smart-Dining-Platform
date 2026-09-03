package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BillDTO {
    private String reservationId;
    private String confirmationCode;
    private String restaurantName;
    private String restaurantCity;
    private List<String> tableNumbers;
    private List<BillLineDTO> lines;
    private BigDecimal subtotal;
    private BigDecimal depositPaid;
    private BigDecimal amountDue;
    private Boolean paid;
    private LocalDateTime paidAt;
    private BigDecimal billAmount;
    private String transactionId;
    private String paymentMethod;
}

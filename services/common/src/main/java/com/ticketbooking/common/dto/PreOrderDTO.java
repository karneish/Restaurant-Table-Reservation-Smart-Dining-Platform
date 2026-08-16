package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PreOrderDTO {
    private Long id;
    private String reservationId;
    private String status;
    private BigDecimal totalAmount;
    private List<PreOrderItemDTO> items;
}

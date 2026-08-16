package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private String reservationId;
    private String confirmationCode;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantCity;
    private Long areaId;
    private String areaName;
    private LocalDateTime reservationDateTime;
    private Integer partySize;
    private BigDecimal depositAmount;
    private String status;
    private String userEmail;
    private String occasion;
    private String celebrationNotes;
    private Boolean waiterCalled;
    private Boolean billRequested;
    private List<OccasionAddOnDTO> addOns;
    private List<RestaurantTableDTO> tables;
    private PreOrderDTO preOrder;
    private PaymentDTO payment;
    private LocalDateTime createdAt;
}

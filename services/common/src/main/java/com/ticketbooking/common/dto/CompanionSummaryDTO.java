package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CompanionSummaryDTO {
    private String reservationId;
    private String confirmationCode;
    private String restaurantName;
    private String restaurantCity;
    private String reservationDateTime;
    private String status;
    private Integer partySize;
    private String occasion;
    private String celebrationNotes;
    private List<RestaurantTableDTO> tables;
    private List<OccasionAddOnDTO> addOns;
    private PreOrderDTO preOrder;
    private Boolean waiterCalled;
    private Boolean billRequested;
    private Boolean billPaid;
    private Boolean feedbackSubmitted;
    private java.math.BigDecimal amountDue;
    private String cleaningStatus;
    private Integer cleaningEtaMinutes;
}

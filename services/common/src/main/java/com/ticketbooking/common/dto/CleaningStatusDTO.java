package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CleaningStatusDTO {
    private Long tableId;
    private String tableNumber;
    private String cleaningStatus;
    private String cleaningStartedAt;
    private Integer cleaningEtaMinutes;
    private Long restaurantId;
}

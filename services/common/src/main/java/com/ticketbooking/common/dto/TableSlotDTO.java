package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TableSlotDTO {
    private Long id;
    private Long tableId;
    private Long restaurantId;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String sessionName;
    private String status;
    private Integer tableCapacity;
    private String tableNumber;
    private String zone;
    private String cleaningStatus;
}

package com.ticketbooking.slotservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class TableSlotRequest {
    @NotNull private Long tableId;
    @NotNull private Long restaurantId;
    @NotNull private LocalDate slotDate;
    @NotNull private LocalTime startTime;
    @NotNull private LocalTime endTime;
    @NotNull private String sessionName;
}

package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ScreenDTO {
    private Long id;
    private Integer screenNumber;
    private Integer totalSeats;
    private Long theatreId;
}

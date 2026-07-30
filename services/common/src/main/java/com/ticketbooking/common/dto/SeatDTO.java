package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SeatDTO {
    private Long id;
    private String seatNumber;
    private String seatRow;
    private String category;
    private String status;
    private Long screenId;
}

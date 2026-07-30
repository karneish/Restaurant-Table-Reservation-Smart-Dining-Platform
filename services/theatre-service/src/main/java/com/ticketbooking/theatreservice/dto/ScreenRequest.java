package com.ticketbooking.theatreservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class ScreenRequest {
    @NotNull @Min(1)
    private Integer screenNumber;
    @NotNull @Min(1)
    private Integer totalSeats;
}

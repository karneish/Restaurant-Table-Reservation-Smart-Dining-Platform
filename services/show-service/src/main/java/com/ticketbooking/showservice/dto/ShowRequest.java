package com.ticketbooking.showservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class ShowRequest {
    @NotNull private Long movieId;
    @NotNull private Long screenId;
    @NotNull private Long theatreId;
    @NotNull private LocalDate showDate;
    @NotNull private LocalTime showTime;
    @NotNull @Min(1) private BigDecimal ticketPrice;
    @NotNull @Min(1) private Integer availableSeats;
}

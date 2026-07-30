package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ShowDTO {
    private Long id;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal ticketPrice;
    private Integer availableSeats;
    private String status;
    private Long movieId;
    private String movieTitle;
    private Long screenId;
    private Integer screenNumber;
    private Long theatreId;
    private String theatreName;
    private String theatreCity;
}

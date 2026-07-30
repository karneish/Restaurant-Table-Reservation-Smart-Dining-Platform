package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String bookingId;
    private String ticketNumber;
    private BigDecimal totalAmount;
    private String status;
    private String userName;
    private String userEmail;
    private String movieTitle;
    private String theatreName;
    private String theatreCity;
    private Integer screenNumber;
    private LocalDate showDate;
    private LocalTime showTime;
    private List<SeatDTO> seats;
    private PaymentDTO payment;
    private LocalDateTime createdAt;
}

package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeedbackDTO {
    private Long id;
    private String reservationId;
    private Long restaurantId;
    private String userEmail;
    private Integer foodRating;
    private Integer serviceRating;
    private Integer ambienceRating;
    private Double overallRating;
    private String comment;
    private LocalDateTime createdAt;
}

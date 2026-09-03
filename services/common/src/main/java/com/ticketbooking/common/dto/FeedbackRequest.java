package com.ticketbooking.common.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class FeedbackRequest {
    @NotNull(message = "Food rating is required")
    @Min(value = 1, message = "Food rating must be between 1 and 5")
    @Max(value = 5, message = "Food rating must be between 1 and 5")
    private Integer foodRating;
    @NotNull(message = "Service rating is required")
    @Min(value = 1, message = "Service rating must be between 1 and 5")
    @Max(value = 5, message = "Service rating must be between 1 and 5")
    private Integer serviceRating;
    @NotNull(message = "Ambience rating is required")
    @Min(value = 1, message = "Ambience rating must be between 1 and 5")
    @Max(value = 5, message = "Ambience rating must be between 1 and 5")
    private Integer ambienceRating;
    @Size(max = 500, message = "Comment cannot exceed 500 characters")
    private String comment;
}

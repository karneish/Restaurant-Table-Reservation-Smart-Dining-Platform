package com.ticketbooking.movieservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class MovieRequest {
    @NotBlank private String title;
    @NotBlank private String language;
    @NotBlank private String genre;
    @NotNull @Min(1) private Integer duration;
    @NotNull @Min(0) @Max(10) private Double rating;
    @NotNull private LocalDate releaseDate;
    private String description;
    private String posterUrl;
}

package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String title;
    private String language;
    private String genre;
    private Integer duration;
    private Double rating;
    private LocalDate releaseDate;
    private String description;
    private String posterUrl;
    private Boolean active;
}

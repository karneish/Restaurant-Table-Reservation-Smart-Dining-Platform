package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OccasionAddOnDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String emoji;
    private String applicableOccasions;
    private Boolean active;
}

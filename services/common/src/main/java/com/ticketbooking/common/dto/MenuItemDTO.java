package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MenuItemDTO {
    private Long id;
    private Long restaurantId;
    private String name;
    private String category;
    private BigDecimal price;
    private String dietaryTags;
    private Integer spiceLevel;
    private Integer prepTimeMinutes;
    private Boolean available;
    private String description;
}

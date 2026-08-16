package com.ticketbooking.restaurantservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
public class MenuItemRequest {
    @NotBlank private String name;
    @NotBlank private String category;
    @NotNull @Min(0) private BigDecimal price;
    private String dietaryTags;
    @Min(0) @Max(3) private Integer spiceLevel;
    @Min(0) private Integer prepTimeMinutes;
    private Boolean available;
    private String description;
}

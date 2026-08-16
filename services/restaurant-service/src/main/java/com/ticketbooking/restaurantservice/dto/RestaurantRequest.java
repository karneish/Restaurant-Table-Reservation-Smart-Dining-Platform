package com.ticketbooking.restaurantservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class RestaurantRequest {
    @NotBlank private String name;
    @NotBlank private String cuisine;
    @NotBlank private String city;
    @NotBlank private String address;
    @NotNull @Min(0) @Max(5) private Double rating;
    @NotNull @Min(0) private Integer avgCostPerHead;
    @NotBlank private String openHours;
    private String imageUrl;
    private String description;
    private String features;
}

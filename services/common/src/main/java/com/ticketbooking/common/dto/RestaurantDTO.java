package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String cuisine;
    private String city;
    private String address;
    private Double rating;
    private Integer avgCostPerHead;
    private String openHours;
    private String imageUrl;
    private String description;
    private String features;
    private Boolean active;
}

package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RestaurantTableDTO {
    private Long id;
    private Long areaId;
    private Long restaurantId;
    private String tableNumber;
    private Integer capacity;
    private String zone;
    private Integer x;
    private Integer y;
    private Boolean wheelchairAccessible;
    private Boolean quietCorner;
    private String cleaningStatus;
    private String cleaningStartedAt;
    private Integer cleaningEtaMinutes;
}

package com.ticketbooking.tableservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class TableRequest {
    @NotBlank private String tableNumber;
    @NotNull @Min(1) private Integer capacity;
    @NotBlank private String zone;
    @NotNull @Min(0) private Integer x;
    @NotNull @Min(0) private Integer y;
    private Boolean wheelchairAccessible;
    private Boolean quietCorner;
}

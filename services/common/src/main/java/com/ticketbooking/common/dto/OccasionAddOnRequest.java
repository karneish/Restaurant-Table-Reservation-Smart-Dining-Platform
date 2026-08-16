package com.ticketbooking.common.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class OccasionAddOnRequest {
    @NotNull(message = "Add-on ID is required")
    private Long addOnId;
    @NotNull(message = "Quantity is required")
    private Integer quantity;
}

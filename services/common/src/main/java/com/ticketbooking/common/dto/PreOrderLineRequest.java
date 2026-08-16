package com.ticketbooking.common.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class PreOrderLineRequest {
    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;
    @NotNull @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}

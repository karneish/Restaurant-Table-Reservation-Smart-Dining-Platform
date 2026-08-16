package com.ticketbooking.tableservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class DiningAreaRequest {
    @NotBlank private String name;
    private String description;
}

package com.ticketbooking.theatreservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class TheatreRequest {
    @NotBlank private String name;
    @NotBlank private String address;
    @NotBlank private String city;
}

package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProfileUpdateRequest {
    private String name;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
}

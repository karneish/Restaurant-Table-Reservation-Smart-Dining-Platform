package com.ticketbooking.notificationservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class EmailRequest {
    @NotBlank @Email
    private String to;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
    private String bookingId;
    private String ticketNumber;
}

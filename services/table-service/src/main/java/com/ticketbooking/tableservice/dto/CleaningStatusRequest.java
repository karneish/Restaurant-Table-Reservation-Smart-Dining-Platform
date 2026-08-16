package com.ticketbooking.tableservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class CleaningStatusRequest {
    @NotBlank private String status;
    private String staffEmail;
    private String note;
    private Integer cleaningEtaMinutes;
}

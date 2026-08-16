package com.ticketbooking.tableservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CleaningLogDTO {
    private Long id;
    private Long tableId;
    private String action;
    private String staffEmail;
    private String note;
    private LocalDateTime timestamp;
}

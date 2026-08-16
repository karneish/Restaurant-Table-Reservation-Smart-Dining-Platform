package com.ticketbooking.tableservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cleaning_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CleaningLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "table_id", nullable = false)
    private Long tableId;
    @Column(nullable = false)
    private String action;
    @Column(name = "staff_email")
    private String staffEmail;
    @Column(columnDefinition = "TEXT")
    private String note;
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() { timestamp = LocalDateTime.now(); }
}

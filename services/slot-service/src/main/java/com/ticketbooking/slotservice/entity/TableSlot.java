package com.ticketbooking.slotservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "table_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TableSlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "table_id", nullable = false)
    private Long tableId;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    @Column(name = "session_name", nullable = false)
    private String sessionName;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;
    @Version
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum SlotStatus { AVAILABLE, HOLD, CONFIRMED, OCCUPIED, CLOSED }
}

package com.ticketbooking.tableservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantTable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "area_id", nullable = false)
    private Long areaId;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "table_number", nullable = false)
    private String tableNumber;
    @Column(nullable = false)
    private Integer capacity;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TableZone zone;
    @Column(nullable = false)
    private Integer x;
    @Column(nullable = false)
    private Integer y;
    @Column(name = "wheelchair_accessible", nullable = false)
    @Builder.Default
    private Boolean wheelchairAccessible = false;
    @Column(name = "quiet_corner", nullable = false)
    @Builder.Default
    private Boolean quietCorner = false;
    @Column(name = "cleaning_status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CleaningStatus cleaningStatus = CleaningStatus.READY;
    @Column(name = "cleaning_started_at")
    private LocalDateTime cleaningStartedAt;
    @Column(name = "cleaning_eta_minutes")
    private Integer cleaningEtaMinutes;
    @Version
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum TableZone { WINDOW, PRIVATE, OUTDOOR, BAR, FAMILY, LOUNGE }

    public enum CleaningStatus { READY, RESERVED, OCCUPIED, DIRTY, CLEANING }
}

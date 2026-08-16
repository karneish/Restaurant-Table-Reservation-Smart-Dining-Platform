package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "table_waitlist")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TableWaitlistEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "slot_id", nullable = false)
    private Long slotId;
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    @Column(name = "party_size", nullable = false)
    private Integer partySize;
    @Column(name = "preferred_window")
    private String preferredWindow;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WaitlistStatus status;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum WaitlistStatus { WAITING, OFFERED, EXPIRED, COMPLETED }
}

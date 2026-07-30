package com.ticketbooking.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long showId;
    @Column(nullable = false)
    private String userEmail;
    @Column(nullable = false)
    private Integer requestedSeats;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WaitlistStatus status;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum WaitlistStatus { WAITING, FULFILLED, EXPIRED }
}

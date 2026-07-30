package com.ticketbooking.showservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "shows")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Show {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long movieId;
    @Column(nullable = false)
    private Long screenId;
    @Column(nullable = false)
    private Long theatreId;
    @Column(nullable = false)
    private LocalDate showDate;
    @Column(nullable = false)
    private LocalTime showTime;
    @Column(name = "ticket_price", nullable = false)
    private BigDecimal ticketPrice;
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ShowStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum ShowStatus { ACTIVE, CANCELLED, COMPLETED }
}

package com.ticketbooking.theatreservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "seat_number", nullable = false)
    private String seatNumber;
    @Column(name = "seat_row", nullable = false)
    private String seatRow;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SeatCategory category;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SeatStatus status;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    @Version
    private Long version;

    public enum SeatCategory { PREMIUM, GOLD, SILVER, REGULAR }
    public enum SeatStatus { AVAILABLE, BOOKED, BLOCKED }
}

package com.ticketbooking.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_seats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingSeat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private BigDecimal price;
    @Column(nullable = false)
    private Long seatId;
    @Column(nullable = false)
    private String seatNumber;
    @Column(nullable = false)
    private String seatRow;
    @Column(nullable = false)
    private String seatCategory;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
}

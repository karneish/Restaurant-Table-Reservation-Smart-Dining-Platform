package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reservation_add_ons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReservationAddOn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
    @Column(name = "add_on_id", nullable = false)
    private Long addOnId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private BigDecimal unitPrice;
    @Column(nullable = false)
    private Integer quantity;
    @Column(nullable = false)
    private BigDecimal totalPrice;
}

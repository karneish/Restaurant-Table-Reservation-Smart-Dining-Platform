package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reserved_tables")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReservedTable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "table_id", nullable = false)
    private Long tableId;
    @Column(name = "table_number", nullable = false)
    private String tableNumber;
    @Column(nullable = false)
    private String zone;
    @Column(nullable = false)
    private Integer capacity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
}

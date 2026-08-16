package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "occasion_add_ons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OccasionAddOn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    private String emoji;
    @Column(name = "applicable_occasions")
    private String applicableOccasions;
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}

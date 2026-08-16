package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pre_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PreOrderStatus status = PreOrderStatus.DRAFT;
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    @OneToMany(mappedBy = "preOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @Builder.Default
    private List<PreOrderItem> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum PreOrderStatus { DRAFT, PLACED, IN_PREP, SERVED, CANCELLED }
}

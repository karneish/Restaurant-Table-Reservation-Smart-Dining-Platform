package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "reservation_id", nullable = false, unique = true)
    private String reservationId;
    @Column(name = "confirmation_code", nullable = false, unique = true)
    private String confirmationCode;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "area_id", nullable = false)
    private Long areaId;
    @Column(name = "slot_id", nullable = false)
    private Long slotId;
    @Column(name = "party_size", nullable = false)
    private Integer partySize;
    @Column(name = "reservation_datetime")
    private LocalDateTime reservationDateTime;
    @Column(name = "deposit_amount", nullable = false)
    private BigDecimal depositAmount;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    private String occasion;
    @Column(name = "celebration_notes", length = 500)
    private String celebrationNotes;
    @Column(name = "waiter_called")
    @Builder.Default
    private Boolean waiterCalled = false;
    @Column(name = "bill_requested")
    @Builder.Default
    private Boolean billRequested = false;
    @Column(name = "bill_paid")
    @Builder.Default
    private Boolean billPaid = false;
    @Column(name = "bill_amount")
    private BigDecimal billAmount;
    @Column(name = "bill_paid_at")
    private LocalDateTime billPaidAt;
    @Column(name = "hold_expires_at")
    private LocalDateTime holdExpiresAt;
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @Builder.Default
    private List<ReservationAddOn> addOns = new ArrayList<>();
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @Builder.Default
    private List<ReservedTable> reservedTables = new ArrayList<>();
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PreOrder preOrder;
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true) @Builder.Default
    private List<Payment> payments = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Deposit payment of this reservation (legacy single-payment access).
     * Null payments default to DEPOSIT for rows created before bill payments existed.
     */
    public Payment getPayment() {
        return payments == null ? null : payments.stream()
                .filter(Payment::isDepositPayment)
                .findFirst()
                .orElse(null);
    }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum ReservationStatus { HOLD, CONFIRMED, SEATED, COMPLETED, CANCELLED }
}

package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_feedbacks",
        uniqueConstraints = @UniqueConstraint(name = "uk_feedback_reservation", columnNames = "reservation_id"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "reservation_id", nullable = false)
    private String reservationId;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "food_rating", nullable = false)
    private Integer foodRating;
    @Column(name = "service_rating", nullable = false)
    private Integer serviceRating;
    @Column(name = "ambience_rating", nullable = false)
    private Integer ambienceRating;
    @Column(name = "overall_rating", nullable = false)
    private Double overallRating;
    @Column(length = 500)
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}

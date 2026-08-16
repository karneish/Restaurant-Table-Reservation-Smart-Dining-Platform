package com.ticketbooking.restaurantservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private BigDecimal price;
    @Column(name = "dietary_tags")
    private String dietaryTags;
    @Column(name = "spice_level", nullable = false)
    @Builder.Default
    private Integer spiceLevel = 0;
    @Column(name = "prep_time_minutes", nullable = false)
    @Builder.Default
    private Integer prepTimeMinutes = 15;
    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}

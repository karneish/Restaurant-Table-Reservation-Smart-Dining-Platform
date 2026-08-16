package com.ticketbooking.reservationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pre_order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreOrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String category;
    @Column(name = "dietary_tags")
    private String dietaryTags;
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;
    @Column(nullable = false)
    private Integer quantity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_order_id", nullable = false)
    private PreOrder preOrder;
}

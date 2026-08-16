package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.PreOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreOrderItemRepository extends JpaRepository<PreOrderItem, Long> {
}

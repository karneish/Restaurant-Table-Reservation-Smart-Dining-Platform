package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.PreOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreOrderRepository extends JpaRepository<PreOrder, Long> {
    Optional<PreOrder> findByReservation_ReservationId(String reservationId);
}

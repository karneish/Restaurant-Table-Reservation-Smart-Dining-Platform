package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.ReservationAddOn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationAddOnRepository extends JpaRepository<ReservationAddOn, Long> {
    List<ReservationAddOn> findByReservationReservationId(String reservationId);
}

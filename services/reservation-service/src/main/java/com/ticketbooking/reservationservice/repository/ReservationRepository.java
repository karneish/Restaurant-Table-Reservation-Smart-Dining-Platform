package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationId(String reservationId);
    Optional<Reservation> findByConfirmationCode(String confirmationCode);
    List<Reservation> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Reservation> findByRestaurantId(Long restaurantId);
    List<Reservation> findByStatusAndHoldExpiresAtBefore(Reservation.ReservationStatus status, java.time.LocalDateTime time);
}

package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    boolean existsByReservationId(String reservationId);
    List<Feedback> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}

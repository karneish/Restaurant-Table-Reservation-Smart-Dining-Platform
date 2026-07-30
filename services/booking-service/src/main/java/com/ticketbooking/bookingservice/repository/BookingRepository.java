package com.ticketbooking.bookingservice.repository;

import com.ticketbooking.bookingservice.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Booking> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    Optional<Booking> findByBookingId(String bookingId);
    Optional<Booking> findByTicketNumber(String ticketNumber);
    boolean existsByBookingId(String bookingId);
}

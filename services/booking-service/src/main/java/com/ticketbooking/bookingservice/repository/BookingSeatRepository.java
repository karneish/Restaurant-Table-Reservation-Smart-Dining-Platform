package com.ticketbooking.bookingservice.repository;

import com.ticketbooking.bookingservice.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
}

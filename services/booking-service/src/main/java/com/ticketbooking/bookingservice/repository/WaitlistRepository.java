package com.ticketbooking.bookingservice.repository;

import com.ticketbooking.bookingservice.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    List<WaitlistEntry> findByShowIdAndStatusOrderByCreatedAtAsc(Long showId, WaitlistEntry.WaitlistStatus status);
    List<WaitlistEntry> findByUserEmail(String userEmail);
    boolean existsByShowIdAndUserEmailAndStatus(Long showId, String userEmail, WaitlistEntry.WaitlistStatus status);
}

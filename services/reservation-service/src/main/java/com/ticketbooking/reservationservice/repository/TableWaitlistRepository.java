package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.TableWaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableWaitlistRepository extends JpaRepository<TableWaitlistEntry, Long> {
    List<TableWaitlistEntry> findByRestaurantIdAndStatusOrderByCreatedAtAsc(Long restaurantId, TableWaitlistEntry.WaitlistStatus status);
    List<TableWaitlistEntry> findByUserEmail(String userEmail);
    boolean existsByRestaurantIdAndSlotIdAndUserEmailAndStatus(Long restaurantId, Long slotId, String userEmail, TableWaitlistEntry.WaitlistStatus status);
    boolean existsByRestaurantIdAndUserEmailAndStatus(Long restaurantId, String userEmail, TableWaitlistEntry.WaitlistStatus status);
}

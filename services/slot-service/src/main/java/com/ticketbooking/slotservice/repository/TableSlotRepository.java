package com.ticketbooking.slotservice.repository;

import com.ticketbooking.slotservice.entity.TableSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TableSlotRepository extends JpaRepository<TableSlot, Long> {
    List<TableSlot> findByRestaurantIdAndSlotDate(Long restaurantId, LocalDate slotDate);
    List<TableSlot> findByRestaurantIdAndSlotDateAndStatus(Long restaurantId, LocalDate slotDate, TableSlot.SlotStatus status);
    List<TableSlot> findByTableId(Long tableId);
}

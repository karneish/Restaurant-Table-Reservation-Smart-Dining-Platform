package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.ReservedTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservedTableRepository extends JpaRepository<ReservedTable, Long> {
}

package com.ticketbooking.tableservice.repository;

import com.ticketbooking.tableservice.entity.CleaningLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CleaningLogRepository extends JpaRepository<CleaningLog, Long> {
    List<CleaningLog> findByTableIdOrderByTimestampDesc(Long tableId);
}

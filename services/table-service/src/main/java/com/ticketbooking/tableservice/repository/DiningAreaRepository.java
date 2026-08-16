package com.ticketbooking.tableservice.repository;

import com.ticketbooking.tableservice.entity.DiningArea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiningAreaRepository extends JpaRepository<DiningArea, Long> {
    List<DiningArea> findByRestaurantId(Long restaurantId);
}

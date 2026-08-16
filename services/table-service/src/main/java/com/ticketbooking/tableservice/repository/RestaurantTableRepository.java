package com.ticketbooking.tableservice.repository;

import com.ticketbooking.tableservice.entity.RestaurantTable;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByAreaId(Long areaId);
    List<RestaurantTable> findByRestaurantId(Long restaurantId);
    List<RestaurantTable> findByRestaurantIdAndCleaningStatus(Long restaurantId, RestaurantTable.CleaningStatus status);
    List<RestaurantTable> findByCleaningStatus(RestaurantTable.CleaningStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM RestaurantTable t WHERE t.id IN :ids")
    List<RestaurantTable> findByIdsWithLock(@Param("ids") Collection<Long> ids);
}

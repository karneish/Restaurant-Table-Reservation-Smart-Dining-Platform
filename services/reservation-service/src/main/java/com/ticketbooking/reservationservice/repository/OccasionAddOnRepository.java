package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.OccasionAddOn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OccasionAddOnRepository extends JpaRepository<OccasionAddOn, Long> {
    List<OccasionAddOn> findByActiveTrue();
    List<OccasionAddOn> findByActiveTrueAndApplicableOccasionsContaining(String occasion);
}

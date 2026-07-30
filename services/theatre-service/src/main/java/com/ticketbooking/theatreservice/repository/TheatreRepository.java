package com.ticketbooking.theatreservice.repository;

import com.ticketbooking.theatreservice.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {
    List<Theatre> findByCity(String city);
    List<Theatre> findByActiveTrue();
    List<Theatre> findByCityAndActiveTrue(String city);
}

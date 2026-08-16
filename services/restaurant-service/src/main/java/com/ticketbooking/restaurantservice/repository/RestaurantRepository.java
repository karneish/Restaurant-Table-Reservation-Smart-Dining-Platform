package com.ticketbooking.restaurantservice.repository;

import com.ticketbooking.restaurantservice.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByActiveTrue();
    List<Restaurant> findByCuisine(String cuisine);
    List<Restaurant> findByCity(String city);
    List<Restaurant> findByCityAndActiveTrue(String city);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
}

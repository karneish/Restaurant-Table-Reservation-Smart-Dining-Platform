package com.ticketbooking.restaurantservice.service;

import com.ticketbooking.common.dto.MenuItemDTO;
import com.ticketbooking.common.dto.RestaurantDTO;
import com.ticketbooking.restaurantservice.dto.MenuItemRequest;
import com.ticketbooking.restaurantservice.dto.RestaurantRequest;

import java.util.List;

public interface RestaurantService {
    List<RestaurantDTO> getAllRestaurants();
    List<RestaurantDTO> getActiveRestaurants();
    RestaurantDTO getRestaurantById(Long id);
    List<RestaurantDTO> searchRestaurants(String query);
    List<RestaurantDTO> getRestaurantsByCuisine(String cuisine);
    List<RestaurantDTO> getRestaurantsByCity(String city);
    RestaurantDTO createRestaurant(RestaurantRequest request);
    RestaurantDTO updateRestaurant(Long id, RestaurantRequest request);
    void deleteRestaurant(Long id);
    List<MenuItemDTO> getMenu(Long restaurantId);
    MenuItemDTO getMenuItem(Long restaurantId, Long itemId);
    MenuItemDTO createMenuItem(Long restaurantId, MenuItemRequest request);
    MenuItemDTO updateMenuItem(Long restaurantId, Long itemId, MenuItemRequest request);
    void deleteMenuItem(Long restaurantId, Long itemId);
}

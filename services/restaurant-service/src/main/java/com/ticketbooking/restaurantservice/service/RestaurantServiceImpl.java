package com.ticketbooking.restaurantservice.service;

import com.ticketbooking.common.dto.MenuItemDTO;
import com.ticketbooking.common.dto.RestaurantDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.restaurantservice.dto.MenuItemRequest;
import com.ticketbooking.restaurantservice.dto.RestaurantRequest;
import com.ticketbooking.restaurantservice.entity.MenuItem;
import com.ticketbooking.restaurantservice.entity.Restaurant;
import com.ticketbooking.restaurantservice.repository.MenuItemRepository;
import com.ticketbooking.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getActiveRestaurants() {
        return restaurantRepository.findByActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public RestaurantDTO getRestaurantById(Long id) {
        return toDTO(restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", id)));
    }

    @Override
    public List<RestaurantDTO> searchRestaurants(String query) {
        List<Restaurant> byName = restaurantRepository.findByNameContainingIgnoreCase(query);
        List<Restaurant> byCuisine = restaurantRepository.findByCuisineContainingIgnoreCase(query);
        byName.addAll(byCuisine.stream().filter(r -> byName.stream().noneMatch(x -> x.getId().equals(r.getId()))).toList());
        return byName.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisine(cuisine).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getRestaurantsByCity(String city) {
        return restaurantRepository.findByCityAndActiveTrue(city).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public RestaurantDTO createRestaurant(RestaurantRequest request) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .cuisine(request.getCuisine())
                .city(request.getCity())
                .address(request.getAddress())
                .rating(request.getRating())
                .avgCostPerHead(request.getAvgCostPerHead())
                .openHours(request.getOpenHours())
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .features(request.getFeatures())
                .status(Restaurant.RestaurantStatus.OPEN)
                .active(true)
                .build();
        restaurant = restaurantRepository.save(restaurant);
        log.info("Restaurant created: {}", restaurant.getName());
        return toDTO(restaurant);
    }

    @Override
    public RestaurantDTO updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", id));
        restaurant.setName(request.getName());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setCity(request.getCity());
        restaurant.setAddress(request.getAddress());
        restaurant.setRating(request.getRating());
        restaurant.setAvgCostPerHead(request.getAvgCostPerHead());
        restaurant.setOpenHours(request.getOpenHours());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setDescription(request.getDescription());
        restaurant.setFeatures(request.getFeatures());
        return toDTO(restaurantRepository.save(restaurant));
    }

    @Override
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", id));
        restaurant.setActive(false);
        restaurant.setStatus(Restaurant.RestaurantStatus.CLOSED);
        restaurantRepository.save(restaurant);
        log.info("Restaurant deactivated: {}", id);
    }

    @Override
    public List<MenuItemDTO> getMenu(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream().map(this::toMenuItemDTO).collect(Collectors.toList());
    }

    @Override
    public MenuItemDTO getMenuItem(Long restaurantId, Long itemId) {
        return toMenuItemDTO(menuItemRepository.findById(itemId)
                .filter(i -> i.getRestaurantId().equals(restaurantId))
                .orElseThrow(() -> new ResourceNotFoundException("Menu item", itemId)));
    }

    @Override
    public MenuItemDTO createMenuItem(Long restaurantId, MenuItemRequest request) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", restaurantId));
        MenuItem item = MenuItem.builder()
                .restaurantId(restaurantId)
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .dietaryTags(request.getDietaryTags())
                .spiceLevel(request.getSpiceLevel() != null ? request.getSpiceLevel() : 0)
                .prepTimeMinutes(request.getPrepTimeMinutes() != null ? request.getPrepTimeMinutes() : 15)
                .available(request.getAvailable() == null || request.getAvailable())
                .description(request.getDescription())
                .build();
        item = menuItemRepository.save(item);
        log.info("Menu item created: {} for restaurant {}", item.getName(), restaurantId);
        return toMenuItemDTO(item);
    }

    @Override
    public MenuItemDTO updateMenuItem(Long restaurantId, Long itemId, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(itemId)
                .filter(i -> i.getRestaurantId().equals(restaurantId))
                .orElseThrow(() -> new ResourceNotFoundException("Menu item", itemId));
        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setDietaryTags(request.getDietaryTags());
        if (request.getSpiceLevel() != null) item.setSpiceLevel(request.getSpiceLevel());
        if (request.getPrepTimeMinutes() != null) item.setPrepTimeMinutes(request.getPrepTimeMinutes());
        if (request.getAvailable() != null) item.setAvailable(request.getAvailable());
        item.setDescription(request.getDescription());
        return toMenuItemDTO(menuItemRepository.save(item));
    }

    @Override
    public void deleteMenuItem(Long restaurantId, Long itemId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .filter(i -> i.getRestaurantId().equals(restaurantId))
                .orElseThrow(() -> new ResourceNotFoundException("Menu item", itemId));
        item.setAvailable(false);
        menuItemRepository.save(item);
    }

    private RestaurantDTO toDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisine(restaurant.getCuisine())
                .city(restaurant.getCity())
                .address(restaurant.getAddress())
                .rating(restaurant.getRating())
                .avgCostPerHead(restaurant.getAvgCostPerHead())
                .openHours(restaurant.getOpenHours())
                .imageUrl(restaurant.getImageUrl())
                .description(restaurant.getDescription())
                .features(restaurant.getFeatures())
                .active(restaurant.getActive())
                .build();
    }

    private MenuItemDTO toMenuItemDTO(MenuItem item) {
        return MenuItemDTO.builder()
                .id(item.getId())
                .restaurantId(item.getRestaurantId())
                .name(item.getName())
                .category(item.getCategory())
                .price(item.getPrice())
                .dietaryTags(item.getDietaryTags())
                .spiceLevel(item.getSpiceLevel())
                .prepTimeMinutes(item.getPrepTimeMinutes())
                .available(item.getAvailable())
                .description(item.getDescription())
                .build();
    }
}

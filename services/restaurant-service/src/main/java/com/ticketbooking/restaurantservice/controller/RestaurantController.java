package com.ticketbooking.restaurantservice.controller;

import com.ticketbooking.common.dto.MenuItemDTO;
import com.ticketbooking.common.dto.RestaurantDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.restaurantservice.dto.MenuItemRequest;
import com.ticketbooking.restaurantservice.dto.RestaurantRequest;
import com.ticketbooking.restaurantservice.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant Management", description = "Restaurant catalog and menu APIs")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "Get all restaurants")
    public ResponseEntity<APIResponse<List<RestaurantDTO>>> getAllRestaurants() {
        return ResponseEntity.ok(APIResponse.success("Restaurants fetched", restaurantService.getAllRestaurants()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get open restaurants")
    public ResponseEntity<APIResponse<List<RestaurantDTO>>> getActiveRestaurants() {
        return ResponseEntity.ok(APIResponse.success("Open restaurants fetched", restaurantService.getActiveRestaurants()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID")
    public ResponseEntity<APIResponse<RestaurantDTO>> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Restaurant fetched", restaurantService.getRestaurantById(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search restaurants by name or cuisine")
    public ResponseEntity<APIResponse<List<RestaurantDTO>>> searchRestaurants(@RequestParam String q) {
        return ResponseEntity.ok(APIResponse.success("Search results", restaurantService.searchRestaurants(q)));
    }

    @GetMapping("/cuisine/{cuisine}")
    @Operation(summary = "Get restaurants by cuisine")
    public ResponseEntity<APIResponse<List<RestaurantDTO>>> getByCuisine(@PathVariable String cuisine) {
        return ResponseEntity.ok(APIResponse.success("Restaurants fetched", restaurantService.getRestaurantsByCuisine(cuisine)));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get restaurants by city")
    public ResponseEntity<APIResponse<List<RestaurantDTO>>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(APIResponse.success("Restaurants fetched", restaurantService.getRestaurantsByCity(city)));
    }

    @PostMapping
    @Operation(summary = "Create a new restaurant (Admin)")
    public ResponseEntity<APIResponse<RestaurantDTO>> createRestaurant(@Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Restaurant created", restaurantService.createRestaurant(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update restaurant (Admin)")
    public ResponseEntity<APIResponse<RestaurantDTO>> updateRestaurant(@PathVariable Long id, @Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.ok(APIResponse.success("Restaurant updated", restaurantService.updateRestaurant(id, request)));
    }

    @PutMapping("/{id}/rating")
    @Operation(summary = "Update aggregated guest rating (internal - called after feedback)")
    public ResponseEntity<APIResponse<RestaurantDTO>> updateRating(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        return ResponseEntity.ok(APIResponse.success("Rating updated", restaurantService.updateRating(id, request.get("rating"))));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate restaurant (Admin)")
    public ResponseEntity<APIResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(APIResponse.success("Restaurant deactivated", null));
    }

    @GetMapping("/{id}/menu")
    @Operation(summary = "Get restaurant menu")
    public ResponseEntity<APIResponse<List<MenuItemDTO>>> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Menu fetched", restaurantService.getMenu(id)));
    }

    @GetMapping("/{id}/menu/{itemId}")
    @Operation(summary = "Get a single menu item")
    public ResponseEntity<APIResponse<MenuItemDTO>> getMenuItem(@PathVariable Long id, @PathVariable Long itemId) {
        return ResponseEntity.ok(APIResponse.success("Menu item fetched", restaurantService.getMenuItem(id, itemId)));
    }

    @PostMapping("/{id}/menu")
    @Operation(summary = "Add menu item (Admin)")
    public ResponseEntity<APIResponse<MenuItemDTO>> createMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Menu item added", restaurantService.createMenuItem(id, request)));
    }

    @PutMapping("/{id}/menu/{itemId}")
    @Operation(summary = "Update menu item (Admin)")
    public ResponseEntity<APIResponse<MenuItemDTO>> updateMenuItem(@PathVariable Long id, @PathVariable Long itemId, @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(APIResponse.success("Menu item updated", restaurantService.updateMenuItem(id, itemId, request)));
    }

    @DeleteMapping("/{id}/menu/{itemId}")
    @Operation(summary = "Deactivate menu item (Admin)")
    public ResponseEntity<APIResponse<Void>> deleteMenuItem(@PathVariable Long id, @PathVariable Long itemId) {
        restaurantService.deleteMenuItem(id, itemId);
        return ResponseEntity.ok(APIResponse.success("Menu item deactivated", null));
    }
}

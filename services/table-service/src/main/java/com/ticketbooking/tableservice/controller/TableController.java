package com.ticketbooking.tableservice.controller;

import com.ticketbooking.common.dto.DiningAreaDTO;
import com.ticketbooking.common.dto.MatchResultDTO;
import com.ticketbooking.common.dto.RestaurantTableDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.tableservice.dto.CleaningLogDTO;
import com.ticketbooking.tableservice.dto.CleaningStatusRequest;
import com.ticketbooking.tableservice.dto.DiningAreaRequest;
import com.ticketbooking.tableservice.dto.TableRequest;
import com.ticketbooking.tableservice.service.TableEventPublisher;
import com.ticketbooking.tableservice.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Table Management", description = "Dining areas, tables, floor plans, cleaning status and smart matching APIs")
public class TableController {

    private final TableService tableService;
    private final TableEventPublisher eventPublisher;

    @GetMapping("/tables/stream")
    @Operation(summary = "Live table cleaning/status updates (SSE)")
    public SseEmitter streamTables() {
        return eventPublisher.subscribe();
    }

    @GetMapping("/restaurants/{restaurantId}/areas")
    @Operation(summary = "Get dining areas of a restaurant")
    public ResponseEntity<APIResponse<List<DiningAreaDTO>>> getAreas(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(APIResponse.success("Areas fetched", tableService.getAreasByRestaurant(restaurantId)));
    }

    @PostMapping("/restaurants/{restaurantId}/areas")
    @Operation(summary = "Add dining area (Admin)")
    public ResponseEntity<APIResponse<DiningAreaDTO>> createArea(@PathVariable Long restaurantId, @Valid @RequestBody DiningAreaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Area created", tableService.createArea(restaurantId, request)));
    }

    @GetMapping("/areas/{areaId}/tables")
    @Operation(summary = "Get table map for an area")
    public ResponseEntity<APIResponse<List<RestaurantTableDTO>>> getTablesByArea(@PathVariable Long areaId) {
        return ResponseEntity.ok(APIResponse.success("Tables fetched", tableService.getTablesByArea(areaId)));
    }

    @PostMapping("/areas/{areaId}/tables")
    @Operation(summary = "Add a table to an area (Admin)")
    public ResponseEntity<APIResponse<RestaurantTableDTO>> createTable(@PathVariable Long areaId, @Valid @RequestBody TableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Table created", tableService.createTable(areaId, request)));
    }

    @GetMapping("/tables/{id}")
    @Operation(summary = "Get table detail and live cleaning status")
    public ResponseEntity<APIResponse<RestaurantTableDTO>> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Table fetched", tableService.getTableById(id)));
    }

    @GetMapping("/tables/match")
    @Operation(summary = "Smart table matches for a party")
    public ResponseEntity<APIResponse<List<MatchResultDTO>>> findMatches(
            @RequestParam Long restaurantId,
            @RequestParam Integer partySize,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) Boolean accessible,
            @RequestParam(required = false) Boolean quiet,
            @RequestParam(required = false) String occasion) {
        return ResponseEntity.ok(APIResponse.success("Best table matches", tableService.findMatches(restaurantId, partySize, zone, accessible, quiet, occasion)));
    }

    @PutMapping("/tables/{id}/cleaning")
    @Operation(summary = "Update table cleaning status (staff)")
    public ResponseEntity<APIResponse<RestaurantTableDTO>> updateCleaningStatus(@PathVariable Long id, @Valid @RequestBody CleaningStatusRequest request) {
        return ResponseEntity.ok(APIResponse.success("Cleaning status updated", tableService.updateCleaningStatus(id, request)));
    }

    @GetMapping("/tables/{id}/cleaning-log")
    @Operation(summary = "Get cleaning history for a table")
    public ResponseEntity<APIResponse<List<CleaningLogDTO>>> getCleaningLog(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Cleaning log fetched", tableService.getCleaningLog(id)));
    }
}

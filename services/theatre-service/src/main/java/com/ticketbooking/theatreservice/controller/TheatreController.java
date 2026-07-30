package com.ticketbooking.theatreservice.controller;

import com.ticketbooking.common.dto.TheatreDTO;
import com.ticketbooking.common.dto.ScreenDTO;
import com.ticketbooking.common.dto.SeatDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.theatreservice.dto.TheatreRequest;
import com.ticketbooking.theatreservice.dto.ScreenRequest;
import com.ticketbooking.theatreservice.service.TheatreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@RequiredArgsConstructor
@Tag(name = "Theatre Management", description = "Theatre and screen management APIs")
public class TheatreController {

    private final TheatreService theatreService;

    @GetMapping
    @Operation(summary = "Get all theatres")
    public ResponseEntity<APIResponse<List<TheatreDTO>>> getAllTheatres() {
        return ResponseEntity.ok(APIResponse.success("Theatres fetched", theatreService.getAllTheatres()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active theatres")
    public ResponseEntity<APIResponse<List<TheatreDTO>>> getActiveTheatres() {
        return ResponseEntity.ok(APIResponse.success("Active theatres fetched", theatreService.getActiveTheatres()));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get theatres by city")
    public ResponseEntity<APIResponse<List<TheatreDTO>>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(APIResponse.success("Theatres fetched", theatreService.getTheatresByCity(city)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get theatre by ID")
    public ResponseEntity<APIResponse<TheatreDTO>> getTheatreById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Theatre fetched", theatreService.getTheatreById(id)));
    }

    @PostMapping
    @Operation(summary = "Create theatre (Admin)")
    public ResponseEntity<APIResponse<TheatreDTO>> createTheatre(@Valid @RequestBody TheatreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Theatre created", theatreService.createTheatre(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update theatre (Admin)")
    public ResponseEntity<APIResponse<TheatreDTO>> updateTheatre(@PathVariable Long id, @Valid @RequestBody TheatreRequest request) {
        return ResponseEntity.ok(APIResponse.success("Theatre updated", theatreService.updateTheatre(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate theatre (Admin)")
    public ResponseEntity<APIResponse<Void>> deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return ResponseEntity.ok(APIResponse.success("Theatre deactivated", null));
    }

    @PostMapping("/{id}/screens")
    @Operation(summary = "Add screen to theatre (Admin)")
    public ResponseEntity<APIResponse<ScreenDTO>> addScreen(@PathVariable Long id, @Valid @RequestBody ScreenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Screen added", theatreService.addScreen(id, request)));
    }

    @GetMapping("/{id}/screens")
    @Operation(summary = "Get screens by theatre")
    public ResponseEntity<APIResponse<List<ScreenDTO>>> getScreens(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Screens fetched", theatreService.getScreensByTheatre(id)));
    }

    @GetMapping("/screens/{screenId}/seats")
    @Operation(summary = "Get seats by screen")
    public ResponseEntity<APIResponse<List<SeatDTO>>> getSeats(@PathVariable Long screenId) {
        return ResponseEntity.ok(APIResponse.success("Seats fetched", theatreService.getSeatsByScreen(screenId)));
    }
}

package com.ticketbooking.showservice.controller;

import com.ticketbooking.common.dto.ShowDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.showservice.dto.ShowRequest;
import com.ticketbooking.showservice.service.ShowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
@Tag(name = "Show Management", description = "Show scheduling APIs")
public class ShowController {

    private final ShowService showService;

    @GetMapping
    @Operation(summary = "Get all shows")
    public ResponseEntity<APIResponse<List<ShowDTO>>> getAllShows() {
        return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getAllShows()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get show by ID")
    public ResponseEntity<APIResponse<ShowDTO>> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Show fetched", showService.getShowById(id)));
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get shows by movie")
    public ResponseEntity<APIResponse<List<ShowDTO>>> getByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getShowsByMovie(movieId)));
    }

    @GetMapping("/theatre/{theatreId}")
    @Operation(summary = "Get shows by theatre")
    public ResponseEntity<APIResponse<List<ShowDTO>>> getByTheatre(@PathVariable Long theatreId) {
        return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getShowsByTheatre(theatreId)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search shows by movie, theatre, and date")
    public ResponseEntity<APIResponse<List<ShowDTO>>> searchShows(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theatreId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (movieId != null && theatreId != null) {
            return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getShowsByMovieTheatreAndDate(movieId, theatreId, date)));
        } else if (movieId != null) {
            return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getShowsByMovieAndDate(movieId, date)));
        } else if (theatreId != null) {
            return ResponseEntity.ok(APIResponse.success("Shows fetched", showService.getShowsByTheatreAndDate(theatreId, date)));
        }
        return ResponseEntity.badRequest().body(APIResponse.error("Provide movieId or theatreId with date"));
    }

    @PostMapping
    @Operation(summary = "Create show (Admin)")
    public ResponseEntity<APIResponse<ShowDTO>> createShow(@Valid @RequestBody ShowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Show created", showService.createShow(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update show (Admin)")
    public ResponseEntity<APIResponse<ShowDTO>> updateShow(@PathVariable Long id, @Valid @RequestBody ShowRequest request) {
        return ResponseEntity.ok(APIResponse.success("Show updated", showService.updateShow(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel show (Admin)")
    public ResponseEntity<APIResponse<Void>> cancelShow(@PathVariable Long id) {
        showService.cancelShow(id);
        return ResponseEntity.ok(APIResponse.success("Show cancelled", null));
    }
}

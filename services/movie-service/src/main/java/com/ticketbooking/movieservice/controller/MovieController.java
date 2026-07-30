package com.ticketbooking.movieservice.controller;

import com.ticketbooking.common.dto.MovieDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.movieservice.dto.MovieRequest;
import com.ticketbooking.movieservice.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movie Management", description = "Movie catalog APIs")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Get all movies")
    public ResponseEntity<APIResponse<List<MovieDTO>>> getAllMovies() {
        return ResponseEntity.ok(APIResponse.success("Movies fetched", movieService.getAllMovies()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active movies")
    public ResponseEntity<APIResponse<List<MovieDTO>>> getActiveMovies() {
        return ResponseEntity.ok(APIResponse.success("Active movies fetched", movieService.getActiveMovies()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<APIResponse<MovieDTO>> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Movie fetched", movieService.getMovieById(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search movies by title")
    public ResponseEntity<APIResponse<List<MovieDTO>>> searchMovies(@RequestParam String q) {
        return ResponseEntity.ok(APIResponse.success("Search results", movieService.searchMovies(q)));
    }

    @GetMapping("/language/{language}")
    @Operation(summary = "Get movies by language")
    public ResponseEntity<APIResponse<List<MovieDTO>>> getByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(APIResponse.success("Movies fetched", movieService.getMoviesByLanguage(language)));
    }

    @GetMapping("/genre/{genre}")
    @Operation(summary = "Get movies by genre")
    public ResponseEntity<APIResponse<List<MovieDTO>>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(APIResponse.success("Movies fetched", movieService.getMoviesByGenre(genre)));
    }

    @PostMapping
    @Operation(summary = "Create a new movie (Admin)")
    public ResponseEntity<APIResponse<MovieDTO>> createMovie(@Valid @RequestBody MovieRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Movie created", movieService.createMovie(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update movie (Admin)")
    public ResponseEntity<APIResponse<MovieDTO>> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(APIResponse.success("Movie updated", movieService.updateMovie(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate movie (Admin)")
    public ResponseEntity<APIResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(APIResponse.success("Movie deactivated", null));
    }
}

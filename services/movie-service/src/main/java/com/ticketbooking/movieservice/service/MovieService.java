package com.ticketbooking.movieservice.service;

import com.ticketbooking.common.dto.MovieDTO;
import com.ticketbooking.movieservice.dto.MovieRequest;
import java.util.List;

public interface MovieService {
    List<MovieDTO> getAllMovies();
    List<MovieDTO> getActiveMovies();
    MovieDTO getMovieById(Long id);
    List<MovieDTO> searchMovies(String query);
    List<MovieDTO> getMoviesByLanguage(String language);
    List<MovieDTO> getMoviesByGenre(String genre);
    MovieDTO createMovie(MovieRequest request);
    MovieDTO updateMovie(Long id, MovieRequest request);
    void deleteMovie(Long id);
}

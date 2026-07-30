package com.ticketbooking.movieservice.service;

import com.ticketbooking.common.dto.MovieDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.movieservice.dto.MovieRequest;
import com.ticketbooking.movieservice.entity.Movie;
import com.ticketbooking.movieservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MovieDTO> getActiveMovies() {
        return movieRepository.findByActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MovieDTO getMovieById(Long id) {
        return toDTO(movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", id)));
    }

    @Override
    public List<MovieDTO> searchMovies(String query) {
        return movieRepository.findByTitleContainingIgnoreCase(query)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MovieDTO> getMoviesByLanguage(String language) {
        return movieRepository.findByLanguage(language)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MovieDTO> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MovieDTO createMovie(MovieRequest request) {
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .language(request.getLanguage())
                .genre(request.getGenre())
                .duration(request.getDuration())
                .rating(request.getRating())
                .releaseDate(request.getReleaseDate())
                .description(request.getDescription())
                .posterUrl(request.getPosterUrl())
                .active(true)
                .build();
        movie = movieRepository.save(movie);
        log.info("Movie created: {}", movie.getTitle());
        return toDTO(movie);
    }

    @Override
    public MovieDTO updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", id));
        movie.setTitle(request.getTitle());
        movie.setLanguage(request.getLanguage());
        movie.setGenre(request.getGenre());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        return toDTO(movieRepository.save(movie));
    }

    @Override
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", id));
        movie.setActive(false);
        movieRepository.save(movie);
        log.info("Movie deactivated: {}", id);
    }

    private MovieDTO toDTO(Movie movie) {
        return MovieDTO.builder()
                .id(movie.getId()).title(movie.getTitle())
                .language(movie.getLanguage()).genre(movie.getGenre())
                .duration(movie.getDuration()).rating(movie.getRating())
                .releaseDate(movie.getReleaseDate()).description(movie.getDescription())
                .posterUrl(movie.getPosterUrl()).active(movie.getActive())
                .build();
    }
}

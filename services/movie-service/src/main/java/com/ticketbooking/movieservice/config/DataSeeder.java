package com.ticketbooking.movieservice.config;

import com.ticketbooking.movieservice.entity.Movie;
import com.ticketbooking.movieservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final MovieRepository movieRepository;

    @Override
    public void run(String... args) {
        if (movieRepository.count() > 0) { log.info("Movie DB already seeded."); return; }
        List<Movie> movies = List.of(
            Movie.builder().title("Inception").language("English").genre("Sci-Fi").duration(148).rating(8.8).releaseDate(LocalDate.of(2010, 7, 16)).description("A thief who steals corporate secrets through dream-sharing technology").active(true).build(),
            Movie.builder().title("3 Idiots").language("Hindi").genre("Comedy").duration(170).rating(8.4).releaseDate(LocalDate.of(2009, 12, 25)).description("Two friends search for their long-lost college friend").active(true).build(),
            Movie.builder().title("The Dark Knight").language("English").genre("Action").duration(152).rating(9.0).releaseDate(LocalDate.of(2008, 7, 18)).description("Batman faces the Joker in Gotham City").active(true).build(),
            Movie.builder().title("Interstellar").language("English").genre("Sci-Fi").duration(169).rating(8.7).releaseDate(LocalDate.of(2014, 11, 7)).description("A team of explorers travel through a wormhole in space").active(true).build(),
            Movie.builder().title("Baahubali 2").language("Telugu").genre("Action").duration(167).rating(8.2).releaseDate(LocalDate.of(2017, 4, 28)).description("Amarendra Baahubali's son avenges his father's death").active(true).build()
        );
        movieRepository.saveAll(movies);
        log.info("{} movies seeded", movies.size());
    }
}

package com.ticketbooking.showservice.repository;

import com.ticketbooking.showservice.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByMovieId(Long movieId);
    List<Show> findByScreenId(Long screenId);
    List<Show> findByTheatreId(Long theatreId);

    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId AND s.showDate = :date AND s.status = 'ACTIVE'")
    List<Show> findByMovieAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Show s WHERE s.theatreId = :theatreId AND s.showDate = :date AND s.status = 'ACTIVE'")
    List<Show> findByTheatreAndDate(@Param("theatreId") Long theatreId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId AND s.theatreId = :theatreId AND s.showDate = :date AND s.status = 'ACTIVE'")
    List<Show> findByMovieAndTheatreAndDate(@Param("movieId") Long movieId, @Param("theatreId") Long theatreId, @Param("date") LocalDate date);

    List<Show> findByShowDateAndStatus(LocalDate date, Show.ShowStatus status);
}

package com.ticketbooking.showservice.service;

import com.ticketbooking.common.dto.ShowDTO;
import com.ticketbooking.showservice.dto.ShowRequest;
import java.time.LocalDate;
import java.util.List;

public interface ShowService {
    List<ShowDTO> getAllShows();
    ShowDTO getShowById(Long id);
    List<ShowDTO> getShowsByMovie(Long movieId);
    List<ShowDTO> getShowsByTheatre(Long theatreId);
    List<ShowDTO> getShowsByMovieAndDate(Long movieId, LocalDate date);
    List<ShowDTO> getShowsByTheatreAndDate(Long theatreId, LocalDate date);
    List<ShowDTO> getShowsByMovieTheatreAndDate(Long movieId, Long theatreId, LocalDate date);
    ShowDTO createShow(ShowRequest request);
    ShowDTO updateShow(Long id, ShowRequest request);
    void cancelShow(Long id);
}

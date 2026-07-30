package com.ticketbooking.showservice.service;

import com.ticketbooking.common.dto.ShowDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.showservice.dto.ShowRequest;
import com.ticketbooking.showservice.entity.Show;
import com.ticketbooking.showservice.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;

    @Override
    public List<ShowDTO> getAllShows() {
        return showRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ShowDTO getShowById(Long id) {
        return toDTO(showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show", id)));
    }

    @Override
    public List<ShowDTO> getShowsByMovie(Long movieId) {
        return showRepository.findByMovieId(movieId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ShowDTO> getShowsByTheatre(Long theatreId) {
        return showRepository.findByTheatreId(theatreId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ShowDTO> getShowsByMovieAndDate(Long movieId, LocalDate date) {
        return showRepository.findByMovieAndDate(movieId, date).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ShowDTO> getShowsByTheatreAndDate(Long theatreId, LocalDate date) {
        return showRepository.findByTheatreAndDate(theatreId, date).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ShowDTO> getShowsByMovieTheatreAndDate(Long movieId, Long theatreId, LocalDate date) {
        return showRepository.findByMovieAndTheatreAndDate(movieId, theatreId, date).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ShowDTO createShow(ShowRequest request) {
        Show show = Show.builder()
                .movieId(request.getMovieId())
                .screenId(request.getScreenId())
                .theatreId(request.getTheatreId())
                .showDate(request.getShowDate())
                .showTime(request.getShowTime())
                .ticketPrice(request.getTicketPrice())
                .availableSeats(request.getAvailableSeats())
                .status(Show.ShowStatus.ACTIVE)
                .build();
        show = showRepository.save(show);
        log.info("Show created for movie {} at theatre {} on {}", show.getMovieId(), show.getTheatreId(), show.getShowDate());
        return toDTO(show);
    }

    @Override
    public ShowDTO updateShow(Long id, ShowRequest request) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show", id));
        show.setMovieId(request.getMovieId());
        show.setScreenId(request.getScreenId());
        show.setTheatreId(request.getTheatreId());
        show.setShowDate(request.getShowDate());
        show.setShowTime(request.getShowTime());
        show.setTicketPrice(request.getTicketPrice());
        show.setAvailableSeats(request.getAvailableSeats());
        return toDTO(showRepository.save(show));
    }

    @Override
    public void cancelShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show", id));
        show.setStatus(Show.ShowStatus.CANCELLED);
        showRepository.save(show);
        log.info("Show cancelled: {}", id);
    }

    private ShowDTO toDTO(Show show) {
        return ShowDTO.builder()
                .id(show.getId())
                .showDate(show.getShowDate())
                .showTime(show.getShowTime())
                .ticketPrice(show.getTicketPrice())
                .availableSeats(show.getAvailableSeats())
                .status(show.getStatus().name())
                .movieId(show.getMovieId())
                .screenId(show.getScreenId())
                .theatreId(show.getTheatreId())
                .build();
    }
}

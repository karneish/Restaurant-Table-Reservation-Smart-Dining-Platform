package com.ticketbooking.theatreservice.service;

import com.ticketbooking.common.dto.TheatreDTO;
import com.ticketbooking.common.dto.ScreenDTO;
import com.ticketbooking.common.dto.SeatDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.theatreservice.dto.TheatreRequest;
import com.ticketbooking.theatreservice.dto.ScreenRequest;
import com.ticketbooking.theatreservice.entity.*;
import com.ticketbooking.theatreservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TheatreServiceImpl implements TheatreService {

    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;

    @Override
    public List<TheatreDTO> getAllTheatres() {
        return theatreRepository.findAll().stream().map(this::toFullDTO).collect(Collectors.toList());
    }

    @Override
    public List<TheatreDTO> getActiveTheatres() {
        return theatreRepository.findByActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TheatreDTO getTheatreById(Long id) {
        return toFullDTO(theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre", id)));
    }

    @Override
    public List<TheatreDTO> getTheatresByCity(String city) {
        return theatreRepository.findByCityAndActiveTrue(city).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TheatreDTO createTheatre(TheatreRequest request) {
        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .active(true)
                .build();
        theatre = theatreRepository.save(theatre);
        log.info("Theatre created: {}", theatre.getName());
        return toDTO(theatre);
    }

    @Override
    public TheatreDTO updateTheatre(Long id, TheatreRequest request) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre", id));
        theatre.setName(request.getName());
        theatre.setAddress(request.getAddress());
        theatre.setCity(request.getCity());
        return toFullDTO(theatreRepository.save(theatre));
    }

    @Override
    public void deleteTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre", id));
        theatre.setActive(false);
        theatreRepository.save(theatre);
    }

    @Override
    @Transactional
    public ScreenDTO addScreen(Long theatreId, ScreenRequest request) {
        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre", theatreId));
        Screen screen = Screen.builder()
                .screenNumber(request.getScreenNumber())
                .totalSeats(request.getTotalSeats())
                .theatre(theatre)
                .build();
        screen = screenRepository.save(screen);
        createSeats(screen);
        log.info("Screen {} added to theatre {}", screen.getScreenNumber(), theatre.getName());
        return toScreenDTO(screen);
    }

    private void createSeats(Screen screen) {
        List<Seat> seats = new ArrayList<>();
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
        int seatsPerRow = 10;
        int seatCount = 0;
        for (char row : rows) {
            for (int num = 1; num <= seatsPerRow && seatCount < screen.getTotalSeats(); num++) {
                Seat.SeatCategory category;
                if (row <= 'B') category = Seat.SeatCategory.PREMIUM;
                else if (row <= 'D') category = Seat.SeatCategory.GOLD;
                else if (row <= 'F') category = Seat.SeatCategory.SILVER;
                else category = Seat.SeatCategory.REGULAR;
                seats.add(Seat.builder()
                        .seatNumber(String.valueOf(num)).seatRow(String.valueOf(row))
                        .category(category).status(Seat.SeatStatus.AVAILABLE).screen(screen).build());
                seatCount++;
            }
        }
        seatRepository.saveAll(seats);
    }

    @Override
    public List<SeatDTO> getSeatsByScreen(Long screenId) {
        return seatRepository.findByScreenId(screenId).stream().map(this::toSeatDTO).collect(Collectors.toList());
    }

    @Override
    public List<ScreenDTO> getScreensByTheatre(Long theatreId) {
        return screenRepository.findByTheatreId(theatreId).stream().map(this::toScreenDTO).collect(Collectors.toList());
    }

    private TheatreDTO toDTO(Theatre theatre) {
        return TheatreDTO.builder()
                .id(theatre.getId()).name(theatre.getName())
                .address(theatre.getAddress()).city(theatre.getCity())
                .active(theatre.getActive()).build();
    }

    private TheatreDTO toFullDTO(Theatre theatre) {
        return TheatreDTO.builder()
                .id(theatre.getId()).name(theatre.getName())
                .address(theatre.getAddress()).city(theatre.getCity())
                .active(theatre.getActive())
                .screens(theatre.getScreens().stream().map(this::toScreenDTO).collect(Collectors.toList()))
                .build();
    }

    private ScreenDTO toScreenDTO(Screen screen) {
        return ScreenDTO.builder()
                .id(screen.getId()).screenNumber(screen.getScreenNumber())
                .totalSeats(screen.getTotalSeats()).theatreId(screen.getTheatre().getId()).build();
    }

    private SeatDTO toSeatDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId()).seatNumber(seat.getSeatNumber())
                .seatRow(seat.getSeatRow()).category(seat.getCategory().name())
                .status(seat.getStatus().name()).screenId(seat.getScreen().getId()).build();
    }
}

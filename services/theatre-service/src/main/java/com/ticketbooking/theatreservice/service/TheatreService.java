package com.ticketbooking.theatreservice.service;

import com.ticketbooking.common.dto.TheatreDTO;
import com.ticketbooking.common.dto.ScreenDTO;
import com.ticketbooking.common.dto.SeatDTO;
import com.ticketbooking.theatreservice.dto.TheatreRequest;
import com.ticketbooking.theatreservice.dto.ScreenRequest;
import java.util.List;

public interface TheatreService {
    List<TheatreDTO> getAllTheatres();
    List<TheatreDTO> getActiveTheatres();
    TheatreDTO getTheatreById(Long id);
    List<TheatreDTO> getTheatresByCity(String city);
    TheatreDTO createTheatre(TheatreRequest request);
    TheatreDTO updateTheatre(Long id, TheatreRequest request);
    void deleteTheatre(Long id);
    ScreenDTO addScreen(Long theatreId, ScreenRequest request);
    List<SeatDTO> getSeatsByScreen(Long screenId);
    List<ScreenDTO> getScreensByTheatre(Long theatreId);
}

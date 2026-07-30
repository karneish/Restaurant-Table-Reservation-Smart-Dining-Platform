package com.ticketbooking.theatreservice.config;

import com.ticketbooking.theatreservice.entity.*;
import com.ticketbooking.theatreservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (theatreRepository.count() > 0) { log.info("Theatre DB already seeded."); return; }

        Theatre t1 = theatreRepository.save(Theatre.builder().name("PVR Cinemas").address("Andheri West").city("Mumbai").active(true).build());
        Theatre t2 = theatreRepository.save(Theatre.builder().name("INOX Leisure").address("Connaught Place").city("Delhi").active(true).build());
        Theatre t3 = theatreRepository.save(Theatre.builder().name("Cinepolis").address("Hitech City").city("Hyderabad").active(true).build());

        createScreenWithSeats(t1, 1, 40);
        createScreenWithSeats(t1, 2, 50);
        createScreenWithSeats(t2, 1, 40);
        createScreenWithSeats(t2, 2, 60);
        createScreenWithSeats(t3, 1, 40);

        log.info("Theatres, screens, and seats seeded");
    }

    private void createScreenWithSeats(Theatre theatre, int screenNumber, int totalSeats) {
        Screen screen = screenRepository.save(Screen.builder().screenNumber(screenNumber).totalSeats(totalSeats).theatre(theatre).build());
        List<Seat> seats = new ArrayList<>();
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
        int seatsPerRow = 10;
        int seatCount = 0;
        for (char row : rows) {
            for (int num = 1; num <= seatsPerRow && seatCount < totalSeats; num++) {
                Seat.SeatCategory category;
                if (row <= 'B') category = Seat.SeatCategory.PREMIUM;
                else if (row <= 'D') category = Seat.SeatCategory.GOLD;
                else if (row <= 'F') category = Seat.SeatCategory.SILVER;
                else category = Seat.SeatCategory.REGULAR;
                seats.add(Seat.builder().seatNumber(String.valueOf(num)).seatRow(String.valueOf(row))
                        .category(category).status(Seat.SeatStatus.AVAILABLE).screen(screen).build());
                seatCount++;
            }
        }
        seatRepository.saveAll(seats);
    }
}

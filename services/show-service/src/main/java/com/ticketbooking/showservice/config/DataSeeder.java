package com.ticketbooking.showservice.config;

import com.ticketbooking.showservice.entity.Show;
import com.ticketbooking.showservice.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final ShowRepository showRepository;

    @Override
    public void run(String... args) {
        if (showRepository.count() > 0) { log.info("Show DB already seeded."); return; }

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        showRepository.save(Show.builder().movieId(1L).screenId(1L).theatreId(1L).showDate(tomorrow).showTime(LocalTime.of(10, 30)).ticketPrice(BigDecimal.valueOf(200)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(1L).screenId(2L).theatreId(1L).showDate(tomorrow).showTime(LocalTime.of(14, 30)).ticketPrice(BigDecimal.valueOf(350)).availableSeats(50).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(1L).screenId(1L).theatreId(1L).showDate(tomorrow).showTime(LocalTime.of(18, 30)).ticketPrice(BigDecimal.valueOf(400)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(2L).screenId(3L).theatreId(2L).showDate(tomorrow).showTime(LocalTime.of(11, 0)).ticketPrice(BigDecimal.valueOf(180)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(2L).screenId(3L).theatreId(2L).showDate(tomorrow).showTime(LocalTime.of(15, 0)).ticketPrice(BigDecimal.valueOf(250)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(3L).screenId(4L).theatreId(2L).showDate(tomorrow).showTime(LocalTime.of(19, 0)).ticketPrice(BigDecimal.valueOf(450)).availableSeats(60).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(4L).screenId(5L).theatreId(3L).showDate(tomorrow).showTime(LocalTime.of(13, 0)).ticketPrice(BigDecimal.valueOf(250)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());
        showRepository.save(Show.builder().movieId(5L).screenId(5L).theatreId(3L).showDate(tomorrow).showTime(LocalTime.of(17, 30)).ticketPrice(BigDecimal.valueOf(300)).availableSeats(40).status(Show.ShowStatus.ACTIVE).build());

        log.info("Shows seeded for tomorrow");
    }
}

package com.ticketbooking.tableservice.config;

import com.ticketbooking.tableservice.entity.CleaningLog;
import com.ticketbooking.tableservice.entity.DiningArea;
import com.ticketbooking.tableservice.entity.RestaurantTable;
import com.ticketbooking.tableservice.repository.CleaningLogRepository;
import com.ticketbooking.tableservice.repository.DiningAreaRepository;
import com.ticketbooking.tableservice.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final DiningAreaRepository diningAreaRepository;
    private final RestaurantTableRepository tableRepository;
    private final CleaningLogRepository cleaningLogRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (diningAreaRepository.count() > 0) { log.info("Table DB already seeded."); return; }

        for (long r = 1; r <= 3; r++) {
            DiningArea ground = diningAreaRepository.save(DiningArea.builder()
                    .restaurantId(r).name("Ground Floor")
                    .description("Main dining hall with window, bar and family zones").build());
            DiningArea terrace = diningAreaRepository.save(DiningArea.builder()
                    .restaurantId(r).name("Rooftop Terrace")
                    .description("Open-air seating with a great view").build());

            List<RestaurantTable> groundTables = List.of(
                    table(r, ground, "G1", 2, RestaurantTable.TableZone.WINDOW, 1, 1, false, false, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, ground, "G2", 2, RestaurantTable.TableZone.WINDOW, 3, 1, false, false, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, ground, "G3", 4, RestaurantTable.TableZone.WINDOW, 5, 1, true, false, RestaurantTable.CleaningStatus.CLEANING, LocalDateTime.now().minusMinutes(4), 10),
                    table(r, ground, "G4", 4, RestaurantTable.TableZone.PRIVATE, 7, 2, false, true, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, ground, "G5", 4, RestaurantTable.TableZone.OUTDOOR, 1, 4, false, false, RestaurantTable.CleaningStatus.OCCUPIED, null, null),
                    table(r, ground, "G6", 6, RestaurantTable.TableZone.LOUNGE, 4, 4, false, true, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, ground, "G7", 6, RestaurantTable.TableZone.BAR, 7, 4, false, false, RestaurantTable.CleaningStatus.DIRTY, null, null),
                    table(r, ground, "G8", 8, RestaurantTable.TableZone.FAMILY, 3, 6, true, false, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, ground, "G9", 2, RestaurantTable.TableZone.PRIVATE, 6, 6, false, true, RestaurantTable.CleaningStatus.RESERVED, null, null));

            List<RestaurantTable> terraceTables = List.of(
                    table(r, terrace, "T1", 2, RestaurantTable.TableZone.OUTDOOR, 2, 2, false, true, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, terrace, "T2", 4, RestaurantTable.TableZone.OUTDOOR, 1, 4, false, false, RestaurantTable.CleaningStatus.READY, null, null),
                    table(r, terrace, "T3", 4, RestaurantTable.TableZone.PRIVATE, 4, 4, false, true, RestaurantTable.CleaningStatus.CLEANING, LocalDateTime.now().minusMinutes(8), 8),
                    table(r, terrace, "T4", 6, RestaurantTable.TableZone.OUTDOOR, 3, 1, false, false, RestaurantTable.CleaningStatus.READY, null, null));

            tableRepository.saveAll(groundTables);
            tableRepository.saveAll(terraceTables);
            groundTables.forEach(t -> {
                if (t.getCleaningStatus() != RestaurantTable.CleaningStatus.READY) {
                    cleaningLogRepository.save(CleaningLog.builder()
                            .tableId(t.getId()).action("SEEDED").staffEmail("system")
                            .note("Initial status: " + t.getCleaningStatus()).build());
                }
            });
        }

        log.info("Dining areas and tables seeded with live cleaning statuses");
    }

    private RestaurantTable table(Long restaurantId, DiningArea area, String number, int capacity,
                                  RestaurantTable.TableZone zone, int x, int y,
                                  boolean accessible, boolean quiet,
                                  RestaurantTable.CleaningStatus status, LocalDateTime cleaningStarted, Integer eta) {
        return RestaurantTable.builder()
                .areaId(area.getId()).restaurantId(restaurantId).tableNumber(number)
                .capacity(capacity).zone(zone).x(x).y(y)
                .wheelchairAccessible(accessible).quietCorner(quiet)
                .cleaningStatus(status)
                .cleaningStartedAt(cleaningStarted).cleaningEtaMinutes(eta)
                .build();
    }
}

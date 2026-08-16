package com.ticketbooking.slotservice.config;

import com.ticketbooking.slotservice.entity.TableSlot;
import com.ticketbooking.slotservice.repository.TableSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final TableSlotRepository slotRepository;

    @Override
    public void run(String... args) {
        if (slotRepository.count() > 0) { log.info("Slot DB already seeded."); return; }

        // Table IDs are sequential per restaurant (13 tables each, created by table-service seeder):
        // restaurant 1 -> tables 1..13, restaurant 2 -> tables 14..26, restaurant 3 -> tables 27..39
        LocalDate date = LocalDate.now().plusDays(1);

        List<TableSlot> slots = new ArrayList<>();
        for (long restaurant : new long[]{1, 2, 3}) {
            long firstTable = 1 + (restaurant - 1) * 13;
            for (long t = 0; t < 13; t++) {
                long tableId = firstTable + t;
                slots.add(slot(restaurant, tableId, date, LocalTime.of(12, 0), LocalTime.of(14, 30), "LUNCH"));
                slots.add(slot(restaurant, tableId, date, LocalTime.of(14, 30), LocalTime.of(17, 0), "LUNCH"));
                slots.add(slot(restaurant, tableId, date, LocalTime.of(19, 0), LocalTime.of(21, 30), "DINNER"));
                slots.add(slot(restaurant, tableId, date, LocalTime.of(21, 30), LocalTime.of(23, 30), "DINNER"));
            }
        }
        slotRepository.saveAll(slots);
        log.info("{} table slots seeded for tomorrow", slots.size());
    }

    private TableSlot slot(long restaurantId, long tableId, LocalDate date, LocalTime start, LocalTime end, String session) {
        return TableSlot.builder()
                .tableId(tableId)
                .restaurantId(restaurantId)
                .slotDate(date)
                .startTime(start)
                .endTime(end)
                .sessionName(session)
                .status(TableSlot.SlotStatus.AVAILABLE)
                .build();
    }
}

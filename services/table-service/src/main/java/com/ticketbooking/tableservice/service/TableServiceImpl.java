package com.ticketbooking.tableservice.service;

import com.ticketbooking.common.dto.DiningAreaDTO;
import com.ticketbooking.common.dto.MatchResultDTO;
import com.ticketbooking.common.dto.RestaurantTableDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.tableservice.dto.CleaningLogDTO;
import com.ticketbooking.tableservice.dto.CleaningStatusRequest;
import com.ticketbooking.tableservice.dto.DiningAreaRequest;
import com.ticketbooking.tableservice.dto.TableRequest;
import com.ticketbooking.tableservice.entity.CleaningLog;
import com.ticketbooking.tableservice.entity.DiningArea;
import com.ticketbooking.tableservice.entity.RestaurantTable;
import com.ticketbooking.tableservice.repository.CleaningLogRepository;
import com.ticketbooking.tableservice.repository.DiningAreaRepository;
import com.ticketbooking.tableservice.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService {

    private static final Duration AUTO_CLEAN_FINISH = Duration.ofMinutes(5);

    private final DiningAreaRepository diningAreaRepository;
    private final RestaurantTableRepository tableRepository;
    private final CleaningLogRepository cleaningLogRepository;
    private final TableMatchService matchService;
    private final TableEventPublisher eventPublisher;

    @Override
    public List<DiningAreaDTO> getAreasByRestaurant(Long restaurantId) {
        return diningAreaRepository.findByRestaurantId(restaurantId).stream().map(this::toAreaDTO).collect(Collectors.toList());
    }

    @Override
    public DiningAreaDTO createArea(Long restaurantId, DiningAreaRequest request) {
        DiningArea area = DiningArea.builder()
                .restaurantId(restaurantId)
                .name(request.getName())
                .description(request.getDescription())
                .build();
        area = diningAreaRepository.save(area);
        log.info("Dining area created: {} for restaurant {}", area.getName(), restaurantId);
        return toAreaDTO(area);
    }

    @Override
    public List<RestaurantTableDTO> getTablesByArea(Long areaId) {
        return tableRepository.findByAreaId(areaId).stream().map(this::toTableDTO).collect(Collectors.toList());
    }

    @Override
    public List<RestaurantTableDTO> getTablesByRestaurant(Long restaurantId) {
        return tableRepository.findByRestaurantId(restaurantId).stream().map(this::toTableDTO).collect(Collectors.toList());
    }

    @Override
    public RestaurantTableDTO getTableById(Long id) {
        return toTableDTO(tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table", id)));
    }

    @Override
    public RestaurantTableDTO createTable(Long areaId, TableRequest request) {
        DiningArea area = diningAreaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Dining area", areaId));
        RestaurantTable table = RestaurantTable.builder()
                .areaId(areaId)
                .restaurantId(area.getRestaurantId())
                .tableNumber(request.getTableNumber())
                .capacity(request.getCapacity())
                .zone(RestaurantTable.TableZone.valueOf(request.getZone()))
                .x(request.getX())
                .y(request.getY())
                .wheelchairAccessible(Boolean.TRUE.equals(request.getWheelchairAccessible()))
                .quietCorner(Boolean.TRUE.equals(request.getQuietCorner()))
                .cleaningStatus(RestaurantTable.CleaningStatus.READY)
                .build();
        table = tableRepository.save(table);
        log.info("Table {} created in area {}", table.getTableNumber(), areaId);
        return toTableDTO(table);
    }

    @Override
    @Transactional
    public RestaurantTableDTO updateCleaningStatus(Long tableId, CleaningStatusRequest request) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table", tableId));
        RestaurantTable.CleaningStatus target = RestaurantTable.CleaningStatus.valueOf(request.getStatus());
        RestaurantTable.CleaningStatus current = table.getCleaningStatus();
        String note = request.getNote();

        switch (target) {
            case RESERVED -> {
                if (current == RestaurantTable.CleaningStatus.READY) {
                    table.setCleaningStatus(RestaurantTable.CleaningStatus.RESERVED);
                }
                logCleaning(tableId, "RESERVED -> RESERVED", request.getStaffEmail(), "Table held for a reservation" + (note != null ? ": " + note : ""));
            }
            case OCCUPIED -> {
                if (current == RestaurantTable.CleaningStatus.RESERVED || current == RestaurantTable.CleaningStatus.READY) {
                    table.setCleaningStatus(RestaurantTable.CleaningStatus.OCCUPIED);
                    logCleaning(tableId, "SEATED", request.getStaffEmail(), note != null ? note : "Guests seated");
                } else {
                    throw new IllegalStateException("Table " + table.getTableNumber() + " cannot be seated from status " + current);
                }
            }
            case DIRTY -> {
                if (current == RestaurantTable.CleaningStatus.OCCUPIED || current == RestaurantTable.CleaningStatus.RESERVED || current == RestaurantTable.CleaningStatus.READY) {
                    table.setCleaningStatus(RestaurantTable.CleaningStatus.DIRTY);
                    logCleaning(tableId, "DIRTY", request.getStaffEmail(), note != null ? note : "Table needs cleaning");
                } else {
                    throw new IllegalStateException("Table " + table.getTableNumber() + " is already " + current);
                }
            }
            case CLEANING -> {
                if (current == RestaurantTable.CleaningStatus.DIRTY || current == RestaurantTable.CleaningStatus.CLEANING) {
                    table.setCleaningStatus(RestaurantTable.CleaningStatus.CLEANING);
                    table.setCleaningStartedAt(LocalDateTime.now());
                    table.setCleaningEtaMinutes(request.getCleaningEtaMinutes() != null ? request.getCleaningEtaMinutes() : 15);
                    logCleaning(tableId, "CLEANING STARTED", request.getStaffEmail(), note != null ? note : "Cleaning in progress");
                } else {
                    throw new IllegalStateException("Table " + table.getTableNumber() + " must be DIRTY before cleaning");
                }
            }
            case READY -> {
                table.setCleaningStatus(RestaurantTable.CleaningStatus.READY);
                table.setCleaningStartedAt(null);
                table.setCleaningEtaMinutes(null);
                logCleaning(tableId, "READY", request.getStaffEmail(), note != null ? note : "Table clean and available");
            }
        }

        table = tableRepository.save(table);
        eventPublisher.publish("table", toTableDTO(table));
        log.info("Table {} cleaning status: {} -> {}", table.getTableNumber(), current, target);
        return toTableDTO(table);
    }

    private void logCleaning(Long tableId, String action, String staffEmail, String note) {
        cleaningLogRepository.save(CleaningLog.builder()
                .tableId(tableId)
                .action(action)
                .staffEmail(staffEmail != null ? staffEmail : "system")
                .note(note)
                .build());
    }

    @Override
    public List<CleaningLogDTO> getCleaningLog(Long tableId) {
        return cleaningLogRepository.findByTableIdOrderByTimestampDesc(tableId).stream()
                .map(this::toCleaningLogDTO).collect(Collectors.toList());
    }

    @Override
    public List<MatchResultDTO> findMatches(Long restaurantId, Integer partySize, String zone, Boolean accessible, Boolean quiet, String occasion) {
        return matchService.findBestMatches(restaurantId, partySize, zone, accessible, quiet, occasion);
    }

    @org.springframework.scheduling.annotation.Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoFinishCleaning() {
        List<RestaurantTable> cleaning = tableRepository.findByCleaningStatus(RestaurantTable.CleaningStatus.CLEANING);
        List<RestaurantTable> finished = cleaning.stream()
                .filter(t -> t.getCleaningStartedAt() != null
                        && t.getCleaningStartedAt().plus(AUTO_CLEAN_FINISH).isBefore(LocalDateTime.now()))
                .toList();
        for (RestaurantTable table : finished) {
            table.setCleaningStatus(RestaurantTable.CleaningStatus.READY);
            table.setCleaningStartedAt(null);
            table.setCleaningEtaMinutes(null);
            tableRepository.save(table);
            cleaningLogRepository.save(CleaningLog.builder()
                    .tableId(table.getId())
                    .action("READY")
                    .staffEmail("system")
                    .note("Cleaning completed automatically")
                    .build());
            eventPublisher.publish("table", toTableDTO(table));
            log.info("Table {} finished cleaning automatically", table.getTableNumber());
        }
    }

    private DiningAreaDTO toAreaDTO(DiningArea area) {
        return DiningAreaDTO.builder()
                .id(area.getId())
                .restaurantId(area.getRestaurantId())
                .name(area.getName())
                .description(area.getDescription())
                .build();
    }

    private RestaurantTableDTO toTableDTO(RestaurantTable table) {
        return RestaurantTableDTO.builder()
                .id(table.getId())
                .areaId(table.getAreaId())
                .restaurantId(table.getRestaurantId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .zone(table.getZone().name())
                .x(table.getX())
                .y(table.getY())
                .wheelchairAccessible(table.getWheelchairAccessible())
                .quietCorner(table.getQuietCorner())
                .cleaningStatus(table.getCleaningStatus().name())
                .cleaningStartedAt(table.getCleaningStartedAt() != null ? table.getCleaningStartedAt().toString() : null)
                .cleaningEtaMinutes(table.getCleaningEtaMinutes())
                .build();
    }

    private CleaningLogDTO toCleaningLogDTO(CleaningLog log) {
        return CleaningLogDTO.builder()
                .id(log.getId())
                .tableId(log.getTableId())
                .action(log.getAction())
                .staffEmail(log.getStaffEmail())
                .note(log.getNote())
                .timestamp(log.getTimestamp())
                .build();
    }
}

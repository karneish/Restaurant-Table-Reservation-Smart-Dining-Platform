package com.ticketbooking.tableservice.service;

import com.ticketbooking.common.dto.MatchResultDTO;
import com.ticketbooking.common.dto.RestaurantTableDTO;
import com.ticketbooking.tableservice.entity.RestaurantTable;
import com.ticketbooking.tableservice.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TableMatchService {

    private final RestaurantTableRepository tableRepository;

    public List<MatchResultDTO> findBestMatches(Long restaurantId, Integer partySize,
                                                String zone, Boolean accessible, Boolean quiet, String occasion) {
        List<RestaurantTable> all = tableRepository.findByRestaurantId(restaurantId);
        List<RestaurantTable> bookable = all.stream()
                .filter(t -> t.getCleaningStatus() == RestaurantTable.CleaningStatus.READY
                        || t.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING)
                .toList();

        List<MatchResultDTO> results = new ArrayList<>();

        for (RestaurantTable t : bookable) {
            if (accessible != null && accessible && !t.getWheelchairAccessible()) continue;
            if (t.getCapacity() < partySize) continue;
            MatchResultDTO m = scoreSingle(t, partySize, zone, accessible, quiet, occasion);
            if (m != null) results.add(m);
        }

        if (partySize != null && partySize > 4) {
            results.addAll(buildGroups(bookable, partySize, zone, accessible, quiet, occasion));
        }

        results.sort(Comparator.comparingInt(MatchResultDTO::getScore).reversed());
        return results.size() > 6 ? results.subList(0, 6) : results;
    }

    private int occasionBoost(RestaurantTable t, String occasion) {
        if (occasion == null || occasion.isBlank()) return 0;
        String occ = occasion.toUpperCase();
        return switch (occ) {
            case "BIRTHDAY", "CELEBRATION", "HONEYMOON", "ANNIVERSARY" ->
                    (t.getZone() == RestaurantTable.TableZone.WINDOW || t.getZone() == RestaurantTable.TableZone.PRIVATE) ? 12 : 0;
            case "FAMILY" -> t.getZone() == RestaurantTable.TableZone.FAMILY ? 12 : 0;
            case "BUSINESS" -> t.getZone() == RestaurantTable.TableZone.LOUNGE ? 12 : 0;
            default -> 0;
        };
    }

    private String occasionHint(String occasion) {
        if (occasion == null || occasion.isBlank()) return "";
        return switch (occasion.toUpperCase()) {
            case "BIRTHDAY", "CELEBRATION", "HONEYMOON", "ANNIVERSARY" -> " | a lovely spot for " + occasion.toLowerCase();
            case "FAMILY" -> " | perfect for family dining";
            case "BUSINESS" -> " | ideal for business dining";
            default -> "";
        };
    }

    private MatchResultDTO scoreSingle(RestaurantTable t, int partySize, String zone, Boolean accessible, Boolean quiet, String occasion) {
        int score = 100;
        int waste = t.getCapacity() - partySize;
        if (waste > 2) {
            score -= Math.min(40, waste * 8);
        }
        if (zone != null && !zone.isBlank() && t.getZone().name().equalsIgnoreCase(zone)) {
            score += 8;
        }
        if (Boolean.TRUE.equals(accessible) && t.getWheelchairAccessible()) score += 5;
        if (Boolean.TRUE.equals(quiet) && t.getQuietCorner()) score += 5;
        if (t.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING) score -= 8;
        score += occasionBoost(t, occasion);

        score = Math.max(0, Math.min(100, score));

        StringBuilder reason = new StringBuilder("Table " + t.getTableNumber() + " - " + t.getZone() + " zone, seats " + t.getCapacity());
        if (waste == 0) reason.append(" - perfect size");
        else if (waste <= 2) reason.append(" - great fit (").append(waste).append(" spare seat").append(waste > 1 ? "s" : "").append(")");
        else reason.append(" - ").append(waste).append(" seats to spare");
        reason.append(occasionHint(occasion));
        if (t.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING) {
            reason.append(" | being cleaned, ready in ~").append(t.getCleaningEtaMinutes()).append(" min");
        } else {
            reason.append(" | clean and ready now");
        }

        return MatchResultDTO.builder()
                .table(toDTO(t))
                .score(score)
                .reason(reason.toString())
                .grouped(false)
                .totalCapacity(t.getCapacity())
                .build();
    }

    private List<MatchResultDTO> buildGroups(List<RestaurantTable> bookable, int partySize, String zone,
                                             Boolean accessible, Boolean quiet, String occasion) {
        List<MatchResultDTO> groups = new ArrayList<>();
        List<RestaurantTable> sorted = new ArrayList<>(bookable);
        sorted.sort(Comparator.comparingInt(RestaurantTable::getCapacity).reversed());

        for (int i = 0; i < sorted.size(); i++) {
            for (int j = i + 1; j < sorted.size(); j++) {
                RestaurantTable a = sorted.get(i);
                RestaurantTable b = sorted.get(j);
                if (!a.getAreaId().equals(b.getAreaId())) continue;
                if (accessible != null && accessible && (!a.getWheelchairAccessible() || !b.getWheelchairAccessible())) continue;
                int combined = a.getCapacity() + b.getCapacity();
                if (combined < partySize) continue;

                int waste = combined - partySize;
                int score = 100 - Math.min(40, waste * 8);
                if (Boolean.TRUE.equals(quiet) && a.getQuietCorner() && b.getQuietCorner()) score += 5;
                if (a.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING
                        || b.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING) score -= 8;
                score += Math.max(occasionBoost(a, occasion), occasionBoost(b, occasion));
                score = Math.max(0, Math.min(100, score));

                String reason = "Combine Table " + a.getTableNumber() + " + Table " + b.getTableNumber()
                        + " (" + combined + " seats)";
                reason += occasionHint(occasion);
                if (a.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING
                        || b.getCleaningStatus() == RestaurantTable.CleaningStatus.CLEANING) {
                    reason += " | one table being cleaned";
                }

                groups.add(MatchResultDTO.builder()
                        .table(toDTO(a))
                        .score(score)
                        .reason(reason)
                        .grouped(true)
                        .group(List.of(toDTO(a), toDTO(b)))
                        .totalCapacity(combined)
                        .build());
            }
        }
        groups.sort(Comparator.comparingInt(MatchResultDTO::getScore).reversed());
        return groups.size() > 3 ? groups.subList(0, 3) : groups;
    }

    private RestaurantTableDTO toDTO(RestaurantTable t) {
        return RestaurantTableDTO.builder()
                .id(t.getId())
                .areaId(t.getAreaId())
                .restaurantId(t.getRestaurantId())
                .tableNumber(t.getTableNumber())
                .capacity(t.getCapacity())
                .zone(t.getZone().name())
                .x(t.getX())
                .y(t.getY())
                .wheelchairAccessible(t.getWheelchairAccessible())
                .quietCorner(t.getQuietCorner())
                .cleaningStatus(t.getCleaningStatus().name())
                .cleaningEtaMinutes(t.getCleaningEtaMinutes())
                .build();
    }
}

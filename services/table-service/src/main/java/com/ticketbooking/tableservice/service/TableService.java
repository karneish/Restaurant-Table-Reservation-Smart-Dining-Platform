package com.ticketbooking.tableservice.service;

import com.ticketbooking.common.dto.DiningAreaDTO;
import com.ticketbooking.common.dto.MatchResultDTO;
import com.ticketbooking.common.dto.RestaurantTableDTO;
import com.ticketbooking.tableservice.dto.CleaningLogDTO;
import com.ticketbooking.tableservice.dto.CleaningStatusRequest;
import com.ticketbooking.tableservice.dto.DiningAreaRequest;
import com.ticketbooking.tableservice.dto.TableRequest;

import java.util.List;

public interface TableService {
    List<DiningAreaDTO> getAreasByRestaurant(Long restaurantId);
    DiningAreaDTO createArea(Long restaurantId, DiningAreaRequest request);
    List<RestaurantTableDTO> getTablesByArea(Long areaId);
    List<RestaurantTableDTO> getTablesByRestaurant(Long restaurantId);
    RestaurantTableDTO getTableById(Long id);
    RestaurantTableDTO createTable(Long areaId, TableRequest request);
    RestaurantTableDTO updateCleaningStatus(Long tableId, CleaningStatusRequest request);
    List<CleaningLogDTO> getCleaningLog(Long tableId);
    List<MatchResultDTO> findMatches(Long restaurantId, Integer partySize, String zone, Boolean accessible, Boolean quiet, String occasion);
}

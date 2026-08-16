package com.ticketbooking.slotservice.service;

import com.ticketbooking.common.dto.TableSlotDTO;
import com.ticketbooking.slotservice.dto.TableSlotRequest;

import java.time.LocalDate;
import java.util.List;

public interface SlotService {
    List<TableSlotDTO> getAllSlots();
    TableSlotDTO getSlotById(Long id);
    List<TableSlotDTO> getAvailableSlots(Long restaurantId, LocalDate date, Integer partySize);
    List<TableSlotDTO> getSlotsByRestaurantAndDate(Long restaurantId, LocalDate date);
    TableSlotDTO createSlot(TableSlotRequest request);
    TableSlotDTO updateSlotStatus(Long id, String status);
    void closeSlot(Long id);
}

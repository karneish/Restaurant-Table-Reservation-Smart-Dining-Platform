package com.ticketbooking.slotservice.service;

import com.ticketbooking.common.dto.RestaurantTableDTO;
import com.ticketbooking.common.dto.TableSlotDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.slotservice.client.TableServiceClient;
import com.ticketbooking.slotservice.dto.TableSlotRequest;
import com.ticketbooking.slotservice.entity.TableSlot;
import com.ticketbooking.slotservice.repository.TableSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final TableSlotRepository slotRepository;
    private final TableServiceClient tableServiceClient;

    @Override
    public List<TableSlotDTO> getAllSlots() {
        return slotRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TableSlotDTO getSlotById(Long id) {
        return toDTO(slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table slot", id)));
    }

    @Override
    public List<TableSlotDTO> getAvailableSlots(Long restaurantId, LocalDate date, Integer partySize) {
        List<TableSlot> slots = slotRepository.findByRestaurantIdAndSlotDateAndStatus(restaurantId, date, TableSlot.SlotStatus.AVAILABLE);
        return slots.stream()
                .map(this::toDTO)
                .filter(dto -> {
                    if (partySize == null) return true;
                    RestaurantTableDTO table = tableServiceClient.getTableById(dto.getTableId());
                    return table != null && table.getCapacity() != null && table.getCapacity() >= partySize;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TableSlotDTO> getSlotsByRestaurantAndDate(Long restaurantId, LocalDate date) {
        return slotRepository.findByRestaurantIdAndSlotDate(restaurantId, date).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TableSlotDTO createSlot(TableSlotRequest request) {
        TableSlot slot = TableSlot.builder()
                .tableId(request.getTableId())
                .restaurantId(request.getRestaurantId())
                .slotDate(request.getSlotDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .sessionName(request.getSessionName())
                .status(TableSlot.SlotStatus.AVAILABLE)
                .build();
        slot = slotRepository.save(slot);
        log.info("Slot created for table {} on {}", slot.getTableId(), slot.getSlotDate());
        return toDTO(slot);
    }

    @Override
    public TableSlotDTO updateSlotStatus(Long id, String status) {
        TableSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table slot", id));
        slot.setStatus(TableSlot.SlotStatus.valueOf(status));
        slot = slotRepository.save(slot);
        log.info("Slot {} status updated to {}", id, status);
        return toDTO(slot);
    }

    @Override
    public void closeSlot(Long id) {
        TableSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table slot", id));
        slot.setStatus(TableSlot.SlotStatus.CLOSED);
        slotRepository.save(slot);
    }

    private TableSlotDTO toDTO(TableSlot slot) {
        return TableSlotDTO.builder()
                .id(slot.getId())
                .tableId(slot.getTableId())
                .restaurantId(slot.getRestaurantId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .sessionName(slot.getSessionName())
                .status(slot.getStatus().name())
                .build();
    }
}

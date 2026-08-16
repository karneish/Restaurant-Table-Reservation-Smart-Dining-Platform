package com.ticketbooking.slotservice.controller;

import com.ticketbooking.common.dto.TableSlotDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.slotservice.dto.TableSlotRequest;
import com.ticketbooking.slotservice.service.SlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@Tag(name = "Slot Management", description = "Table slot availability and scheduling APIs")
public class SlotController {

    private final SlotService slotService;

    @GetMapping
    @Operation(summary = "Get all slots")
    public ResponseEntity<APIResponse<List<TableSlotDTO>>> getAllSlots() {
        return ResponseEntity.ok(APIResponse.success("Slots fetched", slotService.getAllSlots()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get slot by ID")
    public ResponseEntity<APIResponse<TableSlotDTO>> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Slot fetched", slotService.getSlotById(id)));
    }

    @GetMapping("/availability")
    @Operation(summary = "Get available slots for a restaurant on a date")
    public ResponseEntity<APIResponse<List<TableSlotDTO>>> getAvailableSlots(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer partySize) {
        return ResponseEntity.ok(APIResponse.success("Available slots fetched", slotService.getAvailableSlots(restaurantId, date, partySize)));
    }

    @GetMapping("/restaurant/{restaurantId}/date")
    @Operation(summary = "Get all slots for a restaurant on a date")
    public ResponseEntity<APIResponse<List<TableSlotDTO>>> getSlotsByRestaurantAndDate(
            @PathVariable Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(APIResponse.success("Slots fetched", slotService.getSlotsByRestaurantAndDate(restaurantId, date)));
    }

    @PostMapping
    @Operation(summary = "Create slot (Admin)")
    public ResponseEntity<APIResponse<TableSlotDTO>> createSlot(@Valid @RequestBody TableSlotRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Slot created", slotService.createSlot(request)));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update slot status (reservation engine / admin)")
    public ResponseEntity<APIResponse<TableSlotDTO>> updateSlotStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(APIResponse.success("Slot status updated", slotService.updateSlotStatus(id, request.getOrDefault("status", "AVAILABLE"))));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Close slot (Admin)")
    public ResponseEntity<APIResponse<Void>> closeSlot(@PathVariable Long id) {
        slotService.closeSlot(id);
        return ResponseEntity.ok(APIResponse.success("Slot closed", null));
    }
}

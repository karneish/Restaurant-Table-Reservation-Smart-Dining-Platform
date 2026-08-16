package com.ticketbooking.common.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ReservationRequest {
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    @NotNull(message = "Dining area ID is required")
    private Long areaId;
    @NotNull(message = "Table slot ID is required")
    private Long slotId;
    @NotNull(message = "Party size is required")
    private Integer partySize;
    @NotEmpty(message = "At least one table must be selected")
    private List<Long> tableIds;
    private List<PreOrderLineRequest> preOrderItems;
    private String occasion;
    private String celebrationNotes;
    private List<OccasionAddOnRequest> addOns;
}

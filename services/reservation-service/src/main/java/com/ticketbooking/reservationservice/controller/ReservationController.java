package com.ticketbooking.reservationservice.controller;

import com.ticketbooking.common.dto.BillDTO;
import com.ticketbooking.common.dto.CompanionSummaryDTO;
import com.ticketbooking.common.dto.FeedbackDTO;
import com.ticketbooking.common.dto.FeedbackRequest;
import com.ticketbooking.common.dto.OccasionAddOnDTO;
import com.ticketbooking.common.dto.ReservationDTO;
import com.ticketbooking.common.dto.ReservationRequest;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.reservationservice.entity.TableWaitlistEntry;
import com.ticketbooking.reservationservice.service.ReservationEventPublisher;
import com.ticketbooking.reservationservice.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservation Management", description = "Table reservation, pre-order, payment and waitlist APIs")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationEventPublisher eventPublisher;

    @PostMapping
    @Operation(summary = "Create a reservation (hold tables)")
    public ResponseEntity<APIResponse<ReservationDTO>> createReservation(
            @Valid @RequestBody ReservationRequest request,
            @RequestHeader("X-User-Email") String userEmail) {
        ReservationDTO reservation = reservationService.createReservation(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Tables held. Complete the deposit to confirm.", reservation));
    }

    @PostMapping("/{reservationId}/pay")
    @Operation(summary = "Confirm reservation by paying deposit")
    public ResponseEntity<APIResponse<ReservationDTO>> confirmReservation(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> request) {
        ReservationDTO reservation = reservationService.confirmReservation(reservationId, request.getOrDefault("paymentMethod", "CARD"));
        return ResponseEntity.ok(APIResponse.success("Deposit paid. Reservation confirmed.", reservation));
    }

    @PostMapping("/{reservationId}/cancel")
    @Operation(summary = "Cancel a reservation")
    public ResponseEntity<APIResponse<ReservationDTO>> cancelReservation(
            @PathVariable String reservationId,
            @RequestHeader("X-User-Email") String userEmail) {
        ReservationDTO reservation = reservationService.cancelReservation(reservationId, userEmail);
        return ResponseEntity.ok(APIResponse.success("Reservation cancelled. Tables released.", reservation));
    }

    @GetMapping("/add-ons")
    @Operation(summary = "Get available occasion add-ons")
    public ResponseEntity<APIResponse<List<OccasionAddOnDTO>>> getOccasionAddOns(@RequestParam(required = false) String occasion) {
        List<OccasionAddOnDTO> addOns = occasion == null || occasion.isBlank()
                ? reservationService.getOccasionAddOns()
                : reservationService.getOccasionAddOnsForOccasion(occasion);
        return ResponseEntity.ok(APIResponse.success("Add-ons fetched", addOns));
    }

    @GetMapping("/stream")
    @Operation(summary = "Live reservation updates (SSE)")
    public SseEmitter streamReservations() {
        return eventPublisher.subscribe();
    }

    @GetMapping("/companion/{reservationId}")
    @Operation(summary = "Companion: get reservation summary for QR page")
    public ResponseEntity<APIResponse<CompanionSummaryDTO>> getCompanionSummary(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Summary fetched", reservationService.getCompanionSummary(reservationId)));
    }

    @PostMapping("/companion/{reservationId}/call-waiter")
    @Operation(summary = "Companion: call a waiter")
    public ResponseEntity<APIResponse<CompanionSummaryDTO>> callWaiter(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Waiter on the way!", reservationService.callWaiter(reservationId)));
    }

    @PostMapping("/companion/{reservationId}/request-bill")
    @Operation(summary = "Companion: request the bill")
    public ResponseEntity<APIResponse<CompanionSummaryDTO>> requestBill(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Bill requested", reservationService.requestBill(reservationId)));
    }

    @GetMapping("/companion/{reservationId}/bill")
    @Operation(summary = "Companion: view the itemized bill (QR-safe)")
    public ResponseEntity<APIResponse<BillDTO>> getBill(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Bill fetched", reservationService.getBill(reservationId)));
    }

    @PostMapping("/companion/{reservationId}/pay-bill")
    @Operation(summary = "Companion: settle the bill via virtual QR payment (auto-completes the visit)")
    public ResponseEntity<APIResponse<BillDTO>> payBill(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> request) {
        BillDTO bill = reservationService.payBill(reservationId, request.getOrDefault("paymentMethod", "UPI"));
        return ResponseEntity.ok(APIResponse.success("Bill settled. Thank you for dining with us!", bill));
    }

    @PostMapping("/{reservationId}/feedback")
    @Operation(summary = "Submit guest feedback after a completed visit (QR-safe)")
    public ResponseEntity<APIResponse<FeedbackDTO>> submitFeedback(
            @PathVariable String reservationId,
            @Valid @RequestBody FeedbackRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        FeedbackDTO feedback = reservationService.submitFeedback(reservationId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Thanks for your feedback!", feedback));
    }

    @GetMapping("/feedback/restaurant/{restaurantId}")
    @Operation(summary = "Get guest feedback for a restaurant (Admin)")
    public ResponseEntity<APIResponse<List<FeedbackDTO>>> getRestaurantFeedback(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(APIResponse.success("Feedback fetched", reservationService.getFeedbackForRestaurant(restaurantId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by numeric ID")
    public ResponseEntity<APIResponse<ReservationDTO>> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Reservation fetched", reservationService.getReservationById(id)));
    }

    @GetMapping("/reservation/{reservationId}")
    @Operation(summary = "Get reservation by reservation ID")
    public ResponseEntity<APIResponse<ReservationDTO>> getReservationByReservationId(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Reservation fetched", reservationService.getReservationByReservationId(reservationId)));
    }

    @GetMapping("/user")
    @Operation(summary = "Get current user's reservations")
    public ResponseEntity<APIResponse<List<ReservationDTO>>> getUserReservations(@RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(APIResponse.success("Reservations fetched", reservationService.getReservationsByUser(userEmail)));
    }

    @GetMapping
    @Operation(summary = "Get all reservations (Admin)")
    public ResponseEntity<APIResponse<List<ReservationDTO>>> getAllReservations() {
        return ResponseEntity.ok(APIResponse.success("Reservations fetched", reservationService.getAllReservations()));
    }

    @PutMapping("/{reservationId}/status")
    @Operation(summary = "Update reservation status (staff: SEATED / COMPLETED)")
    public ResponseEntity<APIResponse<ReservationDTO>> updateStatus(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> request) {
        ReservationDTO reservation = reservationService.updateReservationStatus(
                reservationId, request.getOrDefault("status", "SEATED"), request.getOrDefault("staffEmail", "staff@restaurant.com"));
        return ResponseEntity.ok(APIResponse.success("Reservation status updated", reservation));
    }

    @PostMapping("/{reservationId}/preorder")
    @Operation(summary = "Submit pre-order to kitchen")
    public ResponseEntity<APIResponse<ReservationDTO>> submitPreOrder(@PathVariable String reservationId) {
        return ResponseEntity.ok(APIResponse.success("Pre-order sent to kitchen", reservationService.submitPreOrder(reservationId)));
    }

    @PutMapping("/preorders/{preOrderId}/status")
    @Operation(summary = "Update pre-order status (kitchen: IN_PREP / SERVED)")
    public ResponseEntity<APIResponse<ReservationDTO>> updatePreOrderStatus(@PathVariable Long preOrderId, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(APIResponse.success("Pre-order status updated", reservationService.updatePreOrderStatus(preOrderId, request.getOrDefault("status", "IN_PREP"))));
    }

    @PostMapping("/waitlist")
    @Operation(summary = "Join waitlist for a restaurant")
    public ResponseEntity<APIResponse<?>> joinWaitlist(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-Email") String userEmail) {
        Long restaurantId = Long.valueOf(request.get("restaurantId").toString());
        Long slotId = request.get("slotId") == null ? null : Long.valueOf(request.get("slotId").toString());
        int partySize = Integer.parseInt(request.getOrDefault("partySize", "2").toString());
        String preferredWindow = request.getOrDefault("preferredWindow", "").toString();
        return ResponseEntity.ok(reservationService.joinWaitlist(restaurantId, slotId, userEmail, partySize, preferredWindow));
    }

    @GetMapping("/waitlist/user")
    @Operation(summary = "Get current user's waitlist entries")
    public ResponseEntity<APIResponse<List<TableWaitlistEntry>>> getUserWaitlist(@RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(APIResponse.success("Waitlist fetched", reservationService.getUserWaitlist(userEmail)));
    }
}

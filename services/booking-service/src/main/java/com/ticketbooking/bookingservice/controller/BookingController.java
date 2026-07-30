package com.ticketbooking.bookingservice.controller;

import com.ticketbooking.bookingservice.service.BookingService;
import com.ticketbooking.common.dto.BookingDTO;
import com.ticketbooking.common.dto.BookingRequest;
import com.ticketbooking.common.response.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Ticket booking, payment, and cancellation APIs")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a booking (reserve seats)")
    public ResponseEntity<APIResponse<BookingDTO>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader("X-User-Email") String userEmail) {
        BookingDTO booking = bookingService.createBooking(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("Seats reserved. Proceed to payment.", booking));
    }

    @PostMapping("/{bookingId}/pay")
    @Operation(summary = "Confirm booking with payment")
    public ResponseEntity<APIResponse<BookingDTO>> confirmBooking(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        BookingDTO booking = bookingService.confirmBooking(bookingId, request.getOrDefault("paymentMethod", "CARD"));
        return ResponseEntity.ok(APIResponse.success("Payment successful. Booking confirmed.", booking));
    }

    @PostMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<APIResponse<BookingDTO>> cancelBooking(
            @PathVariable String bookingId,
            @RequestHeader("X-User-Email") String userEmail) {
        BookingDTO booking = bookingService.cancelBooking(bookingId, userEmail);
        return ResponseEntity.ok(APIResponse.success("Booking cancelled successfully", booking));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Booking fetched", bookingService.getBookingById(id)));
    }

    @GetMapping("/bookingId/{bookingId}")
    @Operation(summary = "Get booking by booking ID")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingByBookingId(@PathVariable String bookingId) {
        return ResponseEntity.ok(APIResponse.success("Booking fetched", bookingService.getBookingByBookingId(bookingId)));
    }

    @GetMapping("/ticket/{ticketNumber}")
    @Operation(summary = "Get booking by ticket number")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingByTicketNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(APIResponse.success("Booking fetched", bookingService.getBookingByTicketNumber(ticketNumber)));
    }

    @PostMapping("/waitlist")
    @Operation(summary = "Join waitlist for a show")
    public ResponseEntity<APIResponse<?>> joinWaitlist(
            @RequestBody Map<String, Object> request,
            @RequestHeader("X-User-Email") String userEmail) {
        Long showId = Long.valueOf(request.get("showId").toString());
        int seats = Integer.parseInt(request.getOrDefault("seats", "1").toString());
        return ResponseEntity.ok(bookingService.joinWaitlist(showId, userEmail, seats));
    }
}

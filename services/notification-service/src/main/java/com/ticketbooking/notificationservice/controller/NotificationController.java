package com.ticketbooking.notificationservice.controller;

import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.notificationservice.dto.EmailRequest;
import com.ticketbooking.notificationservice.dto.NotificationResponse;
import com.ticketbooking.notificationservice.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Management", description = "Email and SMS notification APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/booking-confirmation")
    @Operation(summary = "Send booking confirmation email")
    public ResponseEntity<APIResponse<NotificationResponse>> sendBookingConfirmation(@Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(APIResponse.success("Notification sent", notificationService.sendBookingConfirmation(request)));
    }

    @PostMapping("/cancellation")
    @Operation(summary = "Send cancellation notification")
    public ResponseEntity<APIResponse<NotificationResponse>> sendCancellation(@Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(APIResponse.success("Notification sent", notificationService.sendCancellationNotification(request)));
    }

    @PostMapping("/payment-receipt")
    @Operation(summary = "Send payment receipt")
    public ResponseEntity<APIResponse<NotificationResponse>> sendPaymentReceipt(@Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(APIResponse.success("Notification sent", notificationService.sendPaymentReceipt(request)));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP email")
    public ResponseEntity<APIResponse<NotificationResponse>> sendOtp(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(APIResponse.success("OTP sent",
                notificationService.sendOtpEmail(request.get("email"), request.get("otp"))));
    }
}

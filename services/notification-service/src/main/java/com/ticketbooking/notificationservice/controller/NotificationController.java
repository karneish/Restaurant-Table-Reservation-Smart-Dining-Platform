package com.ticketbooking.notificationservice.controller;

import com.ticketbooking.common.dto.NotificationDTO;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Management", description = "Email, SMS and in-app notification APIs")
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

    @PostMapping("/waitlist")
    @Operation(summary = "Send waitlist availability notification")
    public ResponseEntity<APIResponse<NotificationResponse>> sendWaitlist(@Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(APIResponse.success("Notification sent", notificationService.sendWaitlistNotification(request)));
    }

    @PostMapping("/call-waiter")
    @Operation(summary = "Notify staff that a table called the waiter")
    public ResponseEntity<APIResponse<NotificationResponse>> sendCallWaiter(@Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(APIResponse.success("Notification sent", notificationService.sendCallWaiterNotification(request)));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP email")
    public ResponseEntity<APIResponse<NotificationResponse>> sendOtp(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(APIResponse.success("OTP sent",
                notificationService.sendOtpEmail(request.get("email"), request.get("otp"))));
    }

    @PostMapping("/push")
    @Operation(summary = "Push an in-app notification for a user")
    public ResponseEntity<APIResponse<NotificationDTO>> push(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(APIResponse.success("Notification pushed", notificationService.push(
                request.get("userEmail"), request.get("type"), request.get("title"), request.get("body"))));
    }

    @GetMapping
    @Operation(summary = "Get in-app notifications for a user")
    public ResponseEntity<APIResponse<List<NotificationDTO>>> getNotifications(@RequestParam String userEmail) {
        return ResponseEntity.ok(APIResponse.success("Notifications fetched", notificationService.getNotifications(userEmail)));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count for a user")
    public ResponseEntity<APIResponse<Long>> getUnreadCount(@RequestParam String userEmail) {
        return ResponseEntity.ok(APIResponse.success("Unread count fetched", notificationService.getUnreadCount(userEmail)));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<APIResponse<NotificationDTO>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("Notification marked as read", notificationService.markRead(id)));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for a user")
    public ResponseEntity<APIResponse<Void>> markAllRead(@RequestParam String userEmail) {
        notificationService.markAllRead(userEmail);
        return ResponseEntity.ok(APIResponse.success("All notifications marked as read", null));
    }
}

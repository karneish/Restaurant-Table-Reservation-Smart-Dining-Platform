package com.ticketbooking.notificationservice.service;

import com.ticketbooking.notificationservice.dto.EmailRequest;
import com.ticketbooking.notificationservice.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    @Override
    public NotificationResponse sendBookingConfirmation(EmailRequest request) {
        log.info("BOOKING CONFIRMATION -> To: {}, Subject: {}, Body: {}", request.getTo(), request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Booking confirmation sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendCancellationNotification(EmailRequest request) {
        log.info("CANCELLATION NOTIFICATION -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        return NotificationResponse.builder()
                .sent(true).message("Cancellation notification sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendPaymentReceipt(EmailRequest request) {
        log.info("PAYMENT RECEIPT -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        return NotificationResponse.builder()
                .sent(true).message("Payment receipt sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendWaitlistNotification(EmailRequest request) {
        log.info("WAITLIST NOTIFICATION -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        return NotificationResponse.builder()
                .sent(true).message("Waitlist notification sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendOtpEmail(String to, String otp) {
        log.info("OTP EMAIL -> To: {}, OTP: {}", to, otp);
        return NotificationResponse.builder()
                .sent(true).message("OTP sent successfully")
                .recipient(to).sentAt(LocalDateTime.now()).build();
    }
}

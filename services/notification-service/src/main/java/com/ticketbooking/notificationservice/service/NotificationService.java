package com.ticketbooking.notificationservice.service;

import com.ticketbooking.notificationservice.dto.EmailRequest;
import com.ticketbooking.notificationservice.dto.NotificationResponse;

public interface NotificationService {
    NotificationResponse sendBookingConfirmation(EmailRequest request);
    NotificationResponse sendCancellationNotification(EmailRequest request);
    NotificationResponse sendPaymentReceipt(EmailRequest request);
    NotificationResponse sendWaitlistNotification(EmailRequest request);
    NotificationResponse sendOtpEmail(String to, String otp);
}

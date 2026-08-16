package com.ticketbooking.notificationservice.service;

import com.ticketbooking.common.dto.NotificationDTO;
import com.ticketbooking.notificationservice.dto.EmailRequest;
import com.ticketbooking.notificationservice.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {
    NotificationResponse sendBookingConfirmation(EmailRequest request);
    NotificationResponse sendCancellationNotification(EmailRequest request);
    NotificationResponse sendPaymentReceipt(EmailRequest request);
    NotificationResponse sendWaitlistNotification(EmailRequest request);
    NotificationResponse sendCallWaiterNotification(EmailRequest request);
    NotificationResponse sendOtpEmail(String to, String otp);

    NotificationDTO push(String userEmail, String type, String title, String body);
    List<NotificationDTO> getNotifications(String userEmail);
    long getUnreadCount(String userEmail);
    NotificationDTO markRead(Long id);
    NotificationDTO markAllRead(String userEmail);
}

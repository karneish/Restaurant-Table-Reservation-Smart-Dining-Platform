package com.ticketbooking.notificationservice.service;

import com.ticketbooking.common.dto.NotificationDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.notificationservice.dto.EmailRequest;
import com.ticketbooking.notificationservice.dto.NotificationResponse;
import com.ticketbooking.notificationservice.entity.Notification;
import com.ticketbooking.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse sendBookingConfirmation(EmailRequest request) {
        log.info("BOOKING CONFIRMATION -> To: {}, Subject: {}, Body: {}", request.getTo(), request.getSubject(), request.getBody());
        push(request.getTo(), "BOOKING_CONFIRMED", request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Booking confirmation sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendCancellationNotification(EmailRequest request) {
        log.info("CANCELLATION NOTIFICATION -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        push(request.getTo(), "CANCELLED", request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Cancellation notification sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendPaymentReceipt(EmailRequest request) {
        log.info("PAYMENT RECEIPT -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        push(request.getTo(), "PAYMENT_RECEIPT", request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Payment receipt sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendWaitlistNotification(EmailRequest request) {
        log.info("WAITLIST NOTIFICATION -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        push(request.getTo(), "WAITLIST_OFFER", request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Waitlist notification sent")
                .recipient(request.getTo()).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendCallWaiterNotification(EmailRequest request) {
        log.info("CALL WAITER -> To: {}, Subject: {}", request.getTo(), request.getSubject());
        push("staff@restaurant.com", "CALL_WAITER", request.getSubject(), request.getBody());
        return NotificationResponse.builder()
                .sent(true).message("Waiter notified")
                .recipient("staff@restaurant.com").sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationResponse sendOtpEmail(String to, String otp) {
        log.info("OTP EMAIL -> To: {}, OTP: {}", to, otp);
        return NotificationResponse.builder()
                .sent(true).message("OTP sent successfully")
                .recipient(to).sentAt(LocalDateTime.now()).build();
    }

    @Override
    public NotificationDTO push(String userEmail, String type, String title, String body) {
        Notification notification = notificationRepository.save(Notification.builder()
                .userEmail(userEmail)
                .type(type)
                .title(title)
                .body(body)
                .build());
        return toDTO(notification);
    }

    @Override
    public List<NotificationDTO> getNotifications(String userEmail) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(String userEmail) {
        return notificationRepository.countByUserEmailAndReadFalse(userEmail);
    }

    @Override
    public NotificationDTO markRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        notification.setRead(true);
        return toDTO(notificationRepository.save(notification));
    }

    @Override
    public NotificationDTO markAllRead(String userEmail) {
        List<Notification> unread = notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .filter(n -> !n.getRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return null;
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .userEmail(n.getUserEmail())
                .type(n.getType())
                .title(n.getTitle())
                .body(n.getBody())
                .read(n.getRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

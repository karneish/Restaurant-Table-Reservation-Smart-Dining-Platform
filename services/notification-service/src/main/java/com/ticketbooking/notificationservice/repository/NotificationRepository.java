package com.ticketbooking.notificationservice.repository;

import com.ticketbooking.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    long countByUserEmailAndReadFalse(String userEmail);
}

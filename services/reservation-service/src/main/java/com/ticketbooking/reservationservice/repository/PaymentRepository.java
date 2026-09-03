package com.ticketbooking.reservationservice.repository;

import com.ticketbooking.reservationservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByReservation_ReservationId(String reservationId);
    Optional<Payment> findTopByReservation_ReservationIdAndPaymentTypeOrderByIdDesc(
            String reservationId, Payment.PaymentType paymentType);
}

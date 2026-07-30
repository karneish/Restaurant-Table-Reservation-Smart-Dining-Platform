package com.ticketbooking.paymentservice.service;

import com.ticketbooking.common.dto.PaymentDTO;
import com.ticketbooking.common.exception.PaymentException;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.common.util.IdGenerator;
import com.ticketbooking.paymentservice.dto.PaymentGatewayRequest;
import com.ticketbooking.paymentservice.entity.PaymentTransaction;
import com.ticketbooking.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    @Transactional
    public PaymentDTO processPayment(PaymentGatewayRequest request) {
        String transactionId = IdGenerator.generateTransactionId();
        boolean paymentSuccess = simulateGatewayCall(request);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .transactionId(transactionId)
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(paymentSuccess ? PaymentTransaction.TransactionStatus.SUCCESS : PaymentTransaction.TransactionStatus.FAILED)
                .gatewayResponse(paymentSuccess ? "Payment approved" : "Payment declined")
                .failureReason(paymentSuccess ? null : "Insufficient funds")
                .build();

        transaction = paymentTransactionRepository.save(transaction);

        if (!paymentSuccess) {
            throw new PaymentException("Payment failed: " + transaction.getFailureReason());
        }

        log.info("Payment processed: {} for booking {}", transactionId, request.getBookingId());
        return toDTO(transaction);
    }

    @Override
    public PaymentDTO getPaymentByTransactionId(String transactionId) {
        return toDTO(paymentTransactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + transactionId)));
    }

    @Override
    @Transactional
    public PaymentDTO refundPayment(String transactionId) {
        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + transactionId));

        if (transaction.getStatus() != PaymentTransaction.TransactionStatus.SUCCESS) {
            throw new PaymentException("Cannot refund a non-successful transaction");
        }

        transaction.setStatus(PaymentTransaction.TransactionStatus.REFUNDED);
        transaction = paymentTransactionRepository.save(transaction);
        log.info("Payment refunded: {}", transactionId);
        return toDTO(transaction);
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentTransactionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private boolean simulateGatewayCall(PaymentGatewayRequest request) {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return !"FAIL".equalsIgnoreCase(request.getCardNumber());
    }

    private PaymentDTO toDTO(PaymentTransaction transaction) {
        return PaymentDTO.builder()
                .id(transaction.getId())
                .transactionId(transaction.getTransactionId())
                .amount(transaction.getAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .status(transaction.getStatus().name())
                .bookingId(transaction.getBookingId())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

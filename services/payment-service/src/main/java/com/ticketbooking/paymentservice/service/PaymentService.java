package com.ticketbooking.paymentservice.service;

import com.ticketbooking.common.dto.PaymentDTO;
import com.ticketbooking.paymentservice.dto.PaymentGatewayRequest;
import java.util.List;

public interface PaymentService {
    PaymentDTO processPayment(PaymentGatewayRequest request);
    PaymentDTO getPaymentByTransactionId(String transactionId);
    PaymentDTO refundPayment(String transactionId);
    List<PaymentDTO> getAllPayments();
}

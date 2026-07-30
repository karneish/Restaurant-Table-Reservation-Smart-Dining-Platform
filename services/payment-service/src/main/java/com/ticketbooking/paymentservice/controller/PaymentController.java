package com.ticketbooking.paymentservice.controller;

import com.ticketbooking.common.dto.PaymentDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.paymentservice.dto.PaymentGatewayRequest;
import com.ticketbooking.paymentservice.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "Payment processing APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @Operation(summary = "Process a payment")
    public ResponseEntity<APIResponse<PaymentDTO>> processPayment(@Valid @RequestBody PaymentGatewayRequest request) {
        return ResponseEntity.ok(APIResponse.success("Payment processed", paymentService.processPayment(request)));
    }

    @GetMapping
    @Operation(summary = "Get all payments (Admin)")
    public ResponseEntity<APIResponse<List<PaymentDTO>>> getAllPayments() {
        return ResponseEntity.ok(APIResponse.success("Payments fetched", paymentService.getAllPayments()));
    }

    @GetMapping("/{transactionId}")
    @Operation(summary = "Get payment by transaction ID")
    public ResponseEntity<APIResponse<PaymentDTO>> getPayment(@PathVariable String transactionId) {
        return ResponseEntity.ok(APIResponse.success("Payment fetched", paymentService.getPaymentByTransactionId(transactionId)));
    }

    @PostMapping("/{transactionId}/refund")
    @Operation(summary = "Refund a payment")
    public ResponseEntity<APIResponse<PaymentDTO>> refundPayment(@PathVariable String transactionId) {
        return ResponseEntity.ok(APIResponse.success("Payment refunded", paymentService.refundPayment(transactionId)));
    }
}

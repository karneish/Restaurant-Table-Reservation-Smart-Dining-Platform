package com.ticketbooking.bookingservice.service;

import com.ticketbooking.bookingservice.client.ShowServiceClient;
import com.ticketbooking.bookingservice.entity.*;
import com.ticketbooking.bookingservice.repository.*;
import com.ticketbooking.common.dto.BookingDTO;
import com.ticketbooking.common.dto.BookingRequest;
import com.ticketbooking.common.dto.PaymentDTO;
import com.ticketbooking.common.dto.SeatDTO;
import com.ticketbooking.common.exception.*;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.common.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PaymentRepository paymentRepository;
    private final WaitlistRepository waitlistRepository;
    private final ShowServiceClient showServiceClient;

    @Override
    @Transactional
    public BookingDTO createBooking(BookingRequest request, String userEmail) {
        var showResponse = showServiceClient.getShowById(request.getShowId());
        if (showResponse == null) {
            throw new ResourceNotFoundException("Show not found with id: " + request.getShowId());
        }

        int requestedSeats = request.getSeatIds().size();
        if (requestedSeats > showResponse.getAvailableSeats()) {
            throw new BookingException("Not enough available seats. Available: " + showResponse.getAvailableSeats());
        }

        BigDecimal totalAmount = showResponse.getTicketPrice().multiply(BigDecimal.valueOf(requestedSeats));

        Booking booking = Booking.builder()
                .bookingId(IdGenerator.generateBookingId())
                .ticketNumber(IdGenerator.generateTicketNumber())
                .totalAmount(totalAmount)
                .status(Booking.BookingStatus.PENDING)
                .userId(0L)
                .showId(request.getShowId())
                .userEmail(userEmail)
                .build();
        booking = bookingRepository.save(booking);

        BigDecimal seatPrice = showResponse.getTicketPrice();
        for (Long seatId : request.getSeatIds()) {
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seatId(seatId)
                    .seatNumber(seatId.toString())
                    .seatRow("")
                    .seatCategory("REGULAR")
                    .price(seatPrice)
                    .build();
            bookingSeatRepository.save(bookingSeat);
            booking.getBookingSeats().add(bookingSeat);
        }

        log.info("Booking created: {} by user: {}", booking.getBookingId(), userEmail);
        return toBookingDTO(booking);
    }

    @Override
    @Transactional
    public BookingDTO confirmBooking(String bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BookingException("Booking is not in pending state");
        }

        Payment payment = Payment.builder()
                .transactionId(IdGenerator.generateTransactionId())
                .amount(booking.getTotalAmount())
                .paymentMethod(paymentMethod)
                .status(Payment.PaymentStatus.SUCCESS)
                .booking(booking)
                .build();
        payment = paymentRepository.save(payment);

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setPayment(payment);
        booking = bookingRepository.save(booking);

        log.info("Booking confirmed: {}, Payment: {}", bookingId, payment.getTransactionId());
        return toBookingDTO(booking);
    }

    @Override
    @Transactional
    public BookingDTO cancelBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUserEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        if (booking.getPayment() != null && booking.getPayment().getStatus() == Payment.PaymentStatus.SUCCESS) {
            Payment payment = booking.getPayment();
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        }

        checkWaitlist(booking.getShowId());

        log.info("Booking cancelled: {} by user: {}", bookingId, userEmail);
        return toBookingDTO(booking);
    }

    private void checkWaitlist(Long showId) {
        List<WaitlistEntry> waiting = waitlistRepository
                .findByShowIdAndStatusOrderByCreatedAtAsc(showId, WaitlistEntry.WaitlistStatus.WAITING);
        if (!waiting.isEmpty()) {
            log.info("{} users on waitlist for show {}", waiting.size(), showId);
        }
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        return toBookingDTO(booking);
    }

    @Override
    public BookingDTO getBookingByBookingId(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return toBookingDTO(booking);
    }

    @Override
    public BookingDTO getBookingByTicketNumber(String ticketNumber) {
        Booking booking = bookingRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ticket: " + ticketNumber));
        return toBookingDTO(booking);
    }

    @Override
    public APIResponse<?> joinWaitlist(Long showId, String userEmail, int seats) {
        if (waitlistRepository.existsByShowIdAndUserEmailAndStatus(showId, userEmail, WaitlistEntry.WaitlistStatus.WAITING)) {
            return APIResponse.error("You are already on the waitlist for this show");
        }
        WaitlistEntry entry = WaitlistEntry.builder()
                .showId(showId)
                .userEmail(userEmail)
                .requestedSeats(seats)
                .status(WaitlistEntry.WaitlistStatus.WAITING)
                .build();
        waitlistRepository.save(entry);
        return APIResponse.success("Added to waitlist. You will be notified when seats become available.", null);
    }

    private BookingDTO toBookingDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .bookingId(booking.getBookingId())
                .ticketNumber(booking.getTicketNumber())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus().name())
                .userEmail(booking.getUserEmail())
                .seats(booking.getBookingSeats().stream()
                        .map(bs -> SeatDTO.builder()
                                .id(bs.getSeatId())
                                .seatNumber(bs.getSeatNumber())
                                .seatRow(bs.getSeatRow())
                                .category(bs.getSeatCategory())
                                .build())
                        .collect(Collectors.toList()))
                .payment(booking.getPayment() != null ? PaymentDTO.builder()
                        .id(booking.getPayment().getId())
                        .transactionId(booking.getPayment().getTransactionId())
                        .amount(booking.getPayment().getAmount())
                        .paymentMethod(booking.getPayment().getPaymentMethod())
                        .status(booking.getPayment().getStatus().name())
                        .createdAt(booking.getPayment().getCreatedAt())
                        .build() : null)
                .createdAt(booking.getCreatedAt())
                .build();
    }
}

package com.ticketbooking.bookingservice.service;

import com.ticketbooking.common.dto.BookingDTO;
import com.ticketbooking.common.dto.BookingRequest;
import com.ticketbooking.common.response.APIResponse;

public interface BookingService {
    BookingDTO createBooking(BookingRequest request, String userEmail);
    BookingDTO confirmBooking(String bookingId, String paymentMethod);
    BookingDTO cancelBooking(String bookingId, String userEmail);
    BookingDTO getBookingById(Long id);
    BookingDTO getBookingByBookingId(String bookingId);
    BookingDTO getBookingByTicketNumber(String ticketNumber);
    APIResponse<?> joinWaitlist(Long showId, String userEmail, int seats);
}

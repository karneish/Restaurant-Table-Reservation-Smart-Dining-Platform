package com.ticketbooking.reservationservice.service;

import com.ticketbooking.common.dto.BillDTO;
import com.ticketbooking.common.dto.CompanionSummaryDTO;
import com.ticketbooking.common.dto.FeedbackDTO;
import com.ticketbooking.common.dto.FeedbackRequest;
import com.ticketbooking.common.dto.OccasionAddOnDTO;
import com.ticketbooking.common.dto.ReservationDTO;
import com.ticketbooking.common.dto.ReservationRequest;
import com.ticketbooking.common.response.APIResponse;

import java.util.List;

public interface ReservationService {
    ReservationDTO createReservation(ReservationRequest request, String userEmail);
    ReservationDTO confirmReservation(String reservationId, String paymentMethod);
    ReservationDTO cancelReservation(String reservationId, String userEmail);
    ReservationDTO getReservationByReservationId(String reservationId);
    ReservationDTO getReservationById(Long id);
    List<ReservationDTO> getReservationsByUser(String userEmail);
    List<ReservationDTO> getAllReservations();
    ReservationDTO updateReservationStatus(String reservationId, String status, String staffEmail);
    ReservationDTO submitPreOrder(String reservationId);
    ReservationDTO updatePreOrderStatus(Long preOrderId, String status);
    APIResponse<?> joinWaitlist(Long restaurantId, Long slotId, String userEmail, int partySize, String preferredWindow);
    List<com.ticketbooking.reservationservice.entity.TableWaitlistEntry> getUserWaitlist(String userEmail);

    List<OccasionAddOnDTO> getOccasionAddOns();
    List<OccasionAddOnDTO> getOccasionAddOnsForOccasion(String occasion);
    CompanionSummaryDTO getCompanionSummary(String reservationId);
    CompanionSummaryDTO callWaiter(String reservationId);
    CompanionSummaryDTO requestBill(String reservationId);

    BillDTO getBill(String reservationId);
    BillDTO payBill(String reservationId, String paymentMethod);

    FeedbackDTO submitFeedback(String reservationId, FeedbackRequest request, String userEmail);
    List<FeedbackDTO> getFeedbackForRestaurant(Long restaurantId);
}

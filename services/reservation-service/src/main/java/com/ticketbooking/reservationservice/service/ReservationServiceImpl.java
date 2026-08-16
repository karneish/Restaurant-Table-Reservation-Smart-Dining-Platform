package com.ticketbooking.reservationservice.service;

import com.ticketbooking.common.dto.*;
import com.ticketbooking.common.exception.*;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.common.util.IdGenerator;
import com.ticketbooking.reservationservice.client.*;
import com.ticketbooking.reservationservice.entity.*;
import com.ticketbooking.reservationservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private static final BigDecimal DEPOSIT_PER_SEAT = BigDecimal.valueOf(100);
    private static final Duration HOLD_DURATION = Duration.ofMinutes(15);

    private final ReservationRepository reservationRepository;
    private final ReservedTableRepository reservedTableRepository;
    private final PaymentRepository paymentRepository;
    private final PreOrderRepository preOrderRepository;
    private final PreOrderItemRepository preOrderItemRepository;
    private final TableWaitlistRepository waitlistRepository;
    private final OccasionAddOnRepository occasionAddOnRepository;
    private final ReservationAddOnRepository reservationAddOnRepository;
    private final SlotServiceClient slotServiceClient;
    private final TableServiceClient tableServiceClient;
    private final MenuServiceClient menuServiceClient;
    private final RestaurantServiceClient restaurantServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final ReservationEventPublisher eventPublisher;

    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationRequest request, String userEmail) {
        TableSlotDTO slot = slotServiceClient.getSlotById(request.getSlotId());
        if (slot == null) {
            throw new ResourceNotFoundException("Table slot not found with id: " + request.getSlotId());
        }
        if (!"AVAILABLE".equals(slot.getStatus())) {
            throw new BookingException("This table slot is no longer available. Please choose another.");
        }

        List<RestaurantTableDTO> tableDTOs = new ArrayList<>();
        for (Long tableId : request.getTableIds()) {
            RestaurantTableDTO table = tableServiceClient.getTableById(tableId);
            if (table == null) {
                throw new ResourceNotFoundException("Table not found with id: " + tableId);
            }
            if (!"READY".equals(table.getCleaningStatus()) && !"CLEANING".equals(table.getCleaningStatus())) {
                throw new BookingException("Table " + table.getTableNumber() + " is not available for booking right now.");
            }
            tableDTOs.add(table);
        }

        BigDecimal deposit = DEPOSIT_PER_SEAT.multiply(BigDecimal.valueOf(request.getPartySize()));

        Reservation reservation = Reservation.builder()
                .reservationId(IdGenerator.generateReservationId())
                .confirmationCode(IdGenerator.generateConfirmationCode())
                .restaurantId(request.getRestaurantId())
                .areaId(request.getAreaId())
                .slotId(request.getSlotId())
                .partySize(request.getPartySize())
                .reservationDateTime(slot.getSlotDate().atTime(slot.getStartTime()))
                .depositAmount(deposit)
                .status(Reservation.ReservationStatus.HOLD)
                .userEmail(userEmail)
                .occasion(request.getOccasion())
                .celebrationNotes(request.getCelebrationNotes())
                .holdExpiresAt(LocalDateTime.now().plus(HOLD_DURATION))
                .waiterCalled(false)
                .billRequested(false)
                .build();
        reservation = reservationRepository.save(reservation);

        for (RestaurantTableDTO table : tableDTOs) {
            ReservedTable reservedTable = ReservedTable.builder()
                    .reservation(reservation)
                    .tableId(table.getId())
                    .tableNumber(table.getTableNumber())
                    .zone(table.getZone())
                    .capacity(table.getCapacity())
                    .build();
            reservedTableRepository.save(reservedTable);
            reservation.getReservedTables().add(reservedTable);

            tableServiceClient.updateCleaningStatus(table.getId(), "RESERVED", userEmail, "Table held for reservation " + reservation.getReservationId());
        }

        slotServiceClient.updateSlotStatus(slot.getId(), "HOLD");

        if (request.getAddOns() != null && !request.getAddOns().isEmpty()) {
            for (OccasionAddOnRequest addOn : request.getAddOns()) {
                OccasionAddOn catalog = occasionAddOnRepository.findById(addOn.getAddOnId())
                        .orElseThrow(() -> new ResourceNotFoundException("Occasion add-on not found with id: " + addOn.getAddOnId()));
                BigDecimal total = catalog.getPrice().multiply(BigDecimal.valueOf(addOn.getQuantity()));
                ReservationAddOn reservationAddOn = ReservationAddOn.builder()
                        .reservation(reservation)
                        .addOnId(catalog.getId())
                        .name(catalog.getName())
                        .unitPrice(catalog.getPrice())
                        .quantity(addOn.getQuantity())
                        .totalPrice(total)
                        .build();
                reservationAddOnRepository.save(reservationAddOn);
                reservation.getAddOns().add(reservationAddOn);
                deposit = deposit.add(total);
            }
            reservation.setDepositAmount(deposit);
            reservation = reservationRepository.save(reservation);
        }

        if (request.getPreOrderItems() != null && !request.getPreOrderItems().isEmpty()) {
            createPreOrder(reservation, request);
        }

        eventPublisher.publishReservation(toDTO(reservation));

        log.info("Reservation created: {} by user: {}", reservation.getReservationId(), userEmail);
        return toDTO(reservation);
    }

    private void createPreOrder(Reservation reservation, ReservationRequest request) {
        PreOrder preOrder = PreOrder.builder()
                .reservation(reservation)
                .status(PreOrder.PreOrderStatus.DRAFT)
                .totalAmount(BigDecimal.ZERO)
                .build();
        preOrder = preOrderRepository.save(preOrder);

        BigDecimal total = BigDecimal.ZERO;
        for (PreOrderLineRequest line : request.getPreOrderItems()) {
            MenuItemDTO item = menuServiceClient.getMenuItem(reservation.getRestaurantId(), line.getMenuItemId());
            if (item == null) {
                throw new BookingException("Menu item not found with id: " + line.getMenuItemId());
            }
            PreOrderItem preOrderItem = PreOrderItem.builder()
                    .preOrder(preOrder)
                    .menuItemId(line.getMenuItemId())
                    .name(item.getName())
                    .category(item.getCategory())
                    .dietaryTags(item.getDietaryTags())
                    .unitPrice(item.getPrice())
                    .quantity(line.getQuantity())
                    .build();
            preOrderItemRepository.save(preOrderItem);
            preOrder.getItems().add(preOrderItem);
            total = total.add(item.getPrice().multiply(BigDecimal.valueOf(line.getQuantity())));
        }
        preOrder.setTotalAmount(total);
        preOrderRepository.save(preOrder);
        reservation.setPreOrder(preOrder);
    }

    @Override
    @Transactional
    public ReservationDTO confirmReservation(String reservationId, String paymentMethod) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (reservation.getStatus() != Reservation.ReservationStatus.HOLD) {
            throw new BookingException("Reservation is not in HOLD state");
        }

        PaymentDTO processed = paymentServiceClient.processPayment(
                reservation.getId(), reservation.getDepositAmount(), paymentMethod,
                null, null, null, null, null);

        Payment payment = Payment.builder()
                .transactionId(processed != null && processed.getTransactionId() != null
                        ? processed.getTransactionId() : IdGenerator.generateTransactionId())
                .amount(reservation.getDepositAmount())
                .paymentMethod(paymentMethod)
                .status(Payment.PaymentStatus.SUCCESS)
                .reservation(reservation)
                .build();
        payment = paymentRepository.save(payment);

        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        reservation.setPayment(payment);
        reservation.setHoldExpiresAt(null);
        reservation = reservationRepository.save(reservation);

        slotServiceClient.updateSlotStatus(reservation.getSlotId(), "CONFIRMED");

        String restaurantName = getRestaurantName(reservation.getRestaurantId());
        notificationServiceClient.sendNotification(reservation.getUserEmail(), "BOOKING_CONFIRMED",
                "Reservation confirmed",
                "Your reservation " + reservation.getReservationId() + " at " + restaurantName
                        + " is confirmed. Deposit of ₹" + reservation.getDepositAmount() + " received. See you soon!");

        eventPublisher.publishReservation(toDTO(reservation));

        log.info("Reservation confirmed: {}, Payment: {}", reservationId, payment.getTransactionId());
        return toDTO(reservation);
    }

    @Override
    @Transactional
    public ReservationDTO cancelReservation(String reservationId, String userEmail) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (!reservation.getUserEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this reservation");
        }
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new BookingException("Reservation is already cancelled");
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservation = reservationRepository.save(reservation);

        if (reservation.getPayment() != null && reservation.getPayment().getStatus() == Payment.PaymentStatus.SUCCESS) {
            paymentServiceClient.refund(reservation.getPayment().getTransactionId());
            reservation.getPayment().setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(reservation.getPayment());
        }
        if (reservation.getPreOrder() != null) {
            reservation.getPreOrder().setStatus(PreOrder.PreOrderStatus.CANCELLED);
            preOrderRepository.save(reservation.getPreOrder());
        }

        for (ReservedTable reservedTable : reservation.getReservedTables()) {
            tableServiceClient.updateCleaningStatus(reservedTable.getTableId(), "READY", userEmail, "Released after cancellation");
        }
        slotServiceClient.updateSlotStatus(reservation.getSlotId(), "AVAILABLE");

        notificationServiceClient.sendNotification(reservation.getUserEmail(), "CANCELLED",
                "Reservation cancelled",
                "Reservation " + reservation.getReservationId() + " has been cancelled. We hope to see you another time.");

        checkWaitlist(reservation.getRestaurantId(), reservation.getSlotId());
        eventPublisher.publishReservation(toDTO(reservation));

        log.info("Reservation cancelled: {} by user: {}", reservationId, userEmail);
        return toDTO(reservation);
    }

    private void checkWaitlist(Long restaurantId, Long slotId) {
        List<TableWaitlistEntry> waiting = waitlistRepository
                .findByRestaurantIdAndStatusOrderByCreatedAtAsc(restaurantId, TableWaitlistEntry.WaitlistStatus.WAITING);
        if (waiting.isEmpty()) {
            return;
        }
        log.info("{} users on waitlist for restaurant {}", waiting.size(), restaurantId);
        waiting.stream().limit(3).forEach(w -> {
            w.setStatus(TableWaitlistEntry.WaitlistStatus.OFFERED);
            waitlistRepository.save(w);
            notificationServiceClient.sendEmail(w.getUserEmail(),
                    "A table just opened up at your waitlisted restaurant!",
                    "A table matching your party size is now available. Please book quickly before it is taken.");
            notificationServiceClient.sendNotification(w.getUserEmail(), "WAITLIST_OFFER",
                    "Your table is ready!",
                    "A table has opened up. Head back and complete your booking before it is gone.");
        });
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void expireHolds() {
        List<Reservation> expired = reservationRepository.findByStatusAndHoldExpiresAtBefore(
                Reservation.ReservationStatus.HOLD, LocalDateTime.now());
        for (Reservation reservation : expired) {
            log.info("Expiring hold for reservation {}", reservation.getReservationId());
            reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            reservationRepository.save(reservation);
            for (ReservedTable reservedTable : reservation.getReservedTables()) {
                tableServiceClient.updateCleaningStatus(reservedTable.getTableId(), "READY", "system",
                        "Hold expired - table released");
            }
            slotServiceClient.updateSlotStatus(reservation.getSlotId(), "AVAILABLE");
            notificationServiceClient.sendNotification(reservation.getUserEmail(), "HOLD_EXPIRED",
                    "Your hold expired",
                    "Your table hold for reservation " + reservation.getReservationId() + " expired without payment. The table has been released.");
            checkWaitlist(reservation.getRestaurantId(), reservation.getSlotId());
            eventPublisher.publishReservation(toDTO(reservation));
        }
        if (!expired.isEmpty()) {
            log.info("Expired {} expired holds", expired.size());
        }
    }

    @Override
    public ReservationDTO getReservationByReservationId(String reservationId) {
        return toDTO(reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId)));
    }

    @Override
    public ReservationDTO getReservationById(Long id) {
        return toDTO(reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", id)));
    }

    @Override
    public List<ReservationDTO> getReservationsByUser(String userEmail) {
        return reservationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReservationDTO updateReservationStatus(String reservationId, String status, String staffEmail) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        Reservation.ReservationStatus target = Reservation.ReservationStatus.valueOf(status);

        switch (target) {
            case SEATED -> {
                reservation.setStatus(Reservation.ReservationStatus.SEATED);
                for (ReservedTable reservedTable : reservation.getReservedTables()) {
                    tableServiceClient.updateCleaningStatus(reservedTable.getTableId(), "OCCUPIED", staffEmail, "Guests seated");
                }
                if (reservation.getPreOrder() != null && reservation.getPreOrder().getStatus() == PreOrder.PreOrderStatus.DRAFT) {
                    reservation.getPreOrder().setStatus(PreOrder.PreOrderStatus.PLACED);
                    preOrderRepository.save(reservation.getPreOrder());
                }
                slotServiceClient.updateSlotStatus(reservation.getSlotId(), "OCCUPIED");
                notificationServiceClient.sendNotification(reservation.getUserEmail(), "SEATED",
                        "You're seated!",
                        "Welcome! Use the QR at your table to call a waiter, reorder, or request the bill.");
            }
            case COMPLETED -> {
                reservation.setStatus(Reservation.ReservationStatus.COMPLETED);
                for (ReservedTable reservedTable : reservation.getReservedTables()) {
                    tableServiceClient.updateCleaningStatus(reservedTable.getTableId(), "DIRTY", staffEmail, "Guests departed - cleaning needed");
                }
                if (reservation.getPreOrder() != null && reservation.getPreOrder().getStatus() != PreOrder.PreOrderStatus.CANCELLED) {
                    reservation.getPreOrder().setStatus(PreOrder.PreOrderStatus.SERVED);
                    preOrderRepository.save(reservation.getPreOrder());
                }
                slotServiceClient.updateSlotStatus(reservation.getSlotId(), "CLOSED");
                notificationServiceClient.sendNotification(reservation.getUserEmail(), "COMPLETED",
                        "Thank you for dining with us!",
                        "We hope you enjoyed your visit. Scan your QR to leave a review or book again soon.");
            }
            default -> throw new BookingException("Staff can only set SEATED or COMPLETED status");
        }

        reservation = reservationRepository.save(reservation);
        eventPublisher.publishReservation(toDTO(reservation));
        log.info("Reservation {} status updated to {} by {}", reservationId, target, staffEmail);
        return toDTO(reservation);
    }

    @Override
    @Transactional
    public ReservationDTO submitPreOrder(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        if (reservation.getPreOrder() == null) {
            throw new BookingException("This reservation has no pre-order");
        }
        reservation.getPreOrder().setStatus(PreOrder.PreOrderStatus.PLACED);
        preOrderRepository.save(reservation.getPreOrder());
        log.info("Pre-order submitted for reservation {}", reservationId);
        return toDTO(reservationRepository.save(reservation));
    }

    @Override
    @Transactional
    public ReservationDTO updatePreOrderStatus(Long preOrderId, String status) {
        PreOrder preOrder = preOrderRepository.findById(preOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pre-order", preOrderId));
        preOrder.setStatus(PreOrder.PreOrderStatus.valueOf(status));
        preOrderRepository.save(preOrder);
        eventPublisher.publishReservation(toDTO(preOrder.getReservation()));
        return toDTO(preOrder.getReservation());
    }

    @Override
    public APIResponse<?> joinWaitlist(Long restaurantId, Long slotId, String userEmail, int partySize, String preferredWindow) {
        boolean alreadyWaiting = slotId != null
                ? waitlistRepository.existsByRestaurantIdAndSlotIdAndUserEmailAndStatus(restaurantId, slotId, userEmail, TableWaitlistEntry.WaitlistStatus.WAITING)
                : waitlistRepository.existsByRestaurantIdAndUserEmailAndStatus(restaurantId, userEmail, TableWaitlistEntry.WaitlistStatus.WAITING);
        if (alreadyWaiting) {
            return APIResponse.error("You are already on the waitlist for this restaurant");
        }
        TableWaitlistEntry entry = TableWaitlistEntry.builder()
                .restaurantId(restaurantId)
                .slotId(slotId)
                .userEmail(userEmail)
                .partySize(partySize)
                .preferredWindow(preferredWindow)
                .status(TableWaitlistEntry.WaitlistStatus.WAITING)
                .build();
        waitlistRepository.save(entry);
        notificationServiceClient.sendNotification(userEmail, "WAITLIST_JOINED",
                "You're on the waitlist",
                "We'll notify you the moment a matching table opens up at this restaurant.");
        return APIResponse.success("Added to waitlist. You will be notified when a matching table becomes ready.", null);
    }

    @Override
    public List<TableWaitlistEntry> getUserWaitlist(String userEmail) {
        return waitlistRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<OccasionAddOnDTO> getOccasionAddOns() {
        return occasionAddOnRepository.findByActiveTrue().stream()
                .map(this::toAddOnDTO).collect(Collectors.toList());
    }

    @Override
    public List<OccasionAddOnDTO> getOccasionAddOnsForOccasion(String occasion) {
        if (occasion == null || occasion.isBlank()) {
            return getOccasionAddOns();
        }
        return occasionAddOnRepository.findByActiveTrueAndApplicableOccasionsContaining(occasion.toUpperCase()).stream()
                .map(this::toAddOnDTO).collect(Collectors.toList());
    }

    @Override
    public CompanionSummaryDTO getCompanionSummary(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        return toCompanionDTO(reservation);
    }

    @Override
    @Transactional
    public CompanionSummaryDTO callWaiter(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        if (reservation.getStatus() != Reservation.ReservationStatus.SEATED) {
            throw new BookingException("The waiter can only be called once you are seated");
        }
        reservation.setWaiterCalled(true);
        reservationRepository.save(reservation);
        notificationServiceClient.sendNotification("staff@restaurant.com", "CALL_WAITER",
                "Waiter requested",
                "Table " + reservation.getReservedTables().stream().map(ReservedTable::getTableNumber)
                        .collect(Collectors.joining(", ")) + " (reservation " + reservationId + ") has requested assistance.");
        eventPublisher.publishReservation(toDTO(reservation));
        return toCompanionDTO(reservation);
    }

    @Override
    @Transactional
    public CompanionSummaryDTO requestBill(String reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        if (reservation.getStatus() != Reservation.ReservationStatus.SEATED) {
            throw new BookingException("The bill can only be requested once you are seated");
        }
        reservation.setBillRequested(true);
        reservationRepository.save(reservation);
        notificationServiceClient.sendNotification("staff@restaurant.com", "BILL_REQUEST",
                "Bill requested",
                "Table " + reservation.getReservedTables().stream().map(ReservedTable::getTableNumber)
                        .collect(Collectors.joining(", ")) + " (reservation " + reservationId + ") has requested the bill.");
        eventPublisher.publishReservation(toDTO(reservation));
        return toCompanionDTO(reservation);
    }

    private String getRestaurantName(Long restaurantId) {
        RestaurantDTO restaurant = restaurantServiceClient.getRestaurantById(restaurantId);
        return restaurant != null && restaurant.getName() != null ? restaurant.getName() : "our restaurant";
    }

    private ReservationDTO toDTO(Reservation reservation) {
        return ReservationDTO.builder()
                .id(reservation.getId())
                .reservationId(reservation.getReservationId())
                .confirmationCode(reservation.getConfirmationCode())
                .restaurantId(reservation.getRestaurantId())
                .areaId(reservation.getAreaId())
                .reservationDateTime(reservation.getReservationDateTime())
                .partySize(reservation.getPartySize())
                .depositAmount(reservation.getDepositAmount())
                .status(reservation.getStatus().name())
                .userEmail(reservation.getUserEmail())
                .occasion(reservation.getOccasion())
                .celebrationNotes(reservation.getCelebrationNotes())
                .waiterCalled(reservation.getWaiterCalled())
                .billRequested(reservation.getBillRequested())
                .addOns(reservation.getAddOns().stream()
                        .map(ao -> OccasionAddOnDTO.builder()
                                .id(ao.getAddOnId())
                                .name(ao.getName())
                                .price(ao.getUnitPrice())
                                .description(ao.getName())
                                .build())
                        .collect(Collectors.toList()))
                .tables(reservation.getReservedTables().stream()
                        .map(rt -> RestaurantTableDTO.builder()
                                .id(rt.getTableId())
                                .areaId(reservation.getAreaId())
                                .restaurantId(reservation.getRestaurantId())
                                .tableNumber(rt.getTableNumber())
                                .capacity(rt.getCapacity())
                                .zone(rt.getZone())
                                .build())
                        .collect(Collectors.toList()))
                .preOrder(reservation.getPreOrder() != null ? toPreOrderDTO(reservation.getPreOrder()) : null)
                .payment(reservation.getPayment() != null ? PaymentDTO.builder()
                        .id(reservation.getPayment().getId())
                        .transactionId(reservation.getPayment().getTransactionId())
                        .amount(reservation.getPayment().getAmount())
                        .paymentMethod(reservation.getPayment().getPaymentMethod())
                        .status(reservation.getPayment().getStatus().name())
                        .createdAt(reservation.getPayment().getCreatedAt())
                        .build() : null)
                .createdAt(reservation.getCreatedAt())
                .build();
    }

    private CompanionSummaryDTO toCompanionDTO(Reservation reservation) {
        RestaurantDTO restaurant = restaurantServiceClient.getRestaurantById(reservation.getRestaurantId());
        String restaurantName = restaurant != null && restaurant.getName() != null ? restaurant.getName() : "Restaurant";
        String restaurantCity = restaurant != null && restaurant.getCity() != null ? restaurant.getCity() : "";
        return CompanionSummaryDTO.builder()
                .reservationId(reservation.getReservationId())
                .confirmationCode(reservation.getConfirmationCode())
                .restaurantName(restaurantName)
                .restaurantCity(restaurantCity)
                .reservationDateTime(reservation.getReservationDateTime() != null
                        ? reservation.getReservationDateTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) : null)
                .status(reservation.getStatus().name())
                .partySize(reservation.getPartySize())
                .occasion(reservation.getOccasion())
                .celebrationNotes(reservation.getCelebrationNotes())
                .tables(reservation.getReservedTables().stream()
                        .map(rt -> RestaurantTableDTO.builder()
                                .id(rt.getTableId())
                                .tableNumber(rt.getTableNumber())
                                .capacity(rt.getCapacity())
                                .zone(rt.getZone())
                                .build())
                        .collect(Collectors.toList()))
                .addOns(reservation.getAddOns().stream()
                        .map(ao -> OccasionAddOnDTO.builder()
                                .id(ao.getAddOnId())
                                .name(ao.getName())
                                .price(ao.getUnitPrice())
                                .build())
                        .collect(Collectors.toList()))
                .preOrder(reservation.getPreOrder() != null ? toPreOrderDTO(reservation.getPreOrder()) : null)
                .waiterCalled(reservation.getWaiterCalled())
                .billRequested(reservation.getBillRequested())
                .build();
    }

    private PreOrderDTO toPreOrderDTO(PreOrder preOrder) {
        return PreOrderDTO.builder()
                .id(preOrder.getId())
                .reservationId(preOrder.getReservation().getReservationId())
                .status(preOrder.getStatus().name())
                .totalAmount(preOrder.getTotalAmount())
                .items(preOrder.getItems().stream()
                        .map(item -> PreOrderItemDTO.builder()
                                .id(item.getId())
                                .menuItemId(item.getMenuItemId())
                                .name(item.getName())
                                .unitPrice(item.getUnitPrice())
                                .quantity(item.getQuantity())
                                .category(item.getCategory())
                                .dietaryTags(item.getDietaryTags())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private OccasionAddOnDTO toAddOnDTO(OccasionAddOn addOn) {
        return OccasionAddOnDTO.builder()
                .id(addOn.getId())
                .name(addOn.getName())
                .description(addOn.getDescription())
                .price(addOn.getPrice())
                .emoji(addOn.getEmoji())
                .applicableOccasions(addOn.getApplicableOccasions())
                .active(addOn.getActive())
                .build();
    }
}

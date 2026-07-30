package com.ticketbooking.common.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

public class IdGenerator {

    public static String generateBookingId() {
        return "BOK" + generateTimestampPart() + generateRandomPart();
    }

    public static String generateTicketNumber() {
        return "TKT" + generateTimestampPart() + generateRandomPart();
    }

    public static String generateTransactionId() {
        return "TXN" + generateTimestampPart() + generateRandomPart();
    }

    public static String generatePaymentLinkId() {
        return "PL" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String generateOtp() {
        return String.valueOf(100000 + ThreadLocalRandom.current().nextInt(900000));
    }

    private static String generateTimestampPart() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    private static String generateRandomPart() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(1000, 9999));
    }
}

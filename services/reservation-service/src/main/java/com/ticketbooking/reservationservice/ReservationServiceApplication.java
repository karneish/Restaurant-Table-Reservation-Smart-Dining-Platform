package com.ticketbooking.reservationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.ticketbooking")
@EnableDiscoveryClient
@EnableScheduling
public class ReservationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationServiceApplication.class, args);
    }
}

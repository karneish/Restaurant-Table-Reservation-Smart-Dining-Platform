package com.ticketbooking.slotservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SlotServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SlotServiceApplication.class, args);
    }
}

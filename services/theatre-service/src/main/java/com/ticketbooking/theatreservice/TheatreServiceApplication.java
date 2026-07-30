package com.ticketbooking.theatreservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class TheatreServiceApplication {
    public static void main(String[] args) { SpringApplication.run(TheatreServiceApplication.class, args); }
}

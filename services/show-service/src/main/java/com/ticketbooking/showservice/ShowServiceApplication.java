package com.ticketbooking.showservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ShowServiceApplication {
    public static void main(String[] args) { SpringApplication.run(ShowServiceApplication.class, args); }
}

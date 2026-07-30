package com.ticketbooking.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String name;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    @Column(nullable = false)
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

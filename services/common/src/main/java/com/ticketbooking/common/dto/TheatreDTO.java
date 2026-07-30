package com.ticketbooking.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TheatreDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private Boolean active;
    private List<ScreenDTO> screens;
}

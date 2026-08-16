package com.ticketbooking.userservice.service;

import com.ticketbooking.common.dto.ProfileUpdateRequest;
import com.ticketbooking.common.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
    UserDTO getProfile(String email);
    UserDTO updateUser(Long id, UserDTO userDTO);
    UserDTO updateProfile(String email, ProfileUpdateRequest request);
    UserDTO createUser(UserDTO userDTO);
    void deleteUser(Long id);
}

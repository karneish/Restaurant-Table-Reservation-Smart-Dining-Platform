package com.ticketbooking.userservice.service;

import com.ticketbooking.common.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
    UserDTO updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
}

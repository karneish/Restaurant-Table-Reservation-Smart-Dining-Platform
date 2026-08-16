package com.ticketbooking.userservice.service;

import com.ticketbooking.common.dto.ProfileUpdateRequest;
import com.ticketbooking.common.dto.UserDTO;
import com.ticketbooking.common.exception.ResourceNotFoundException;
import com.ticketbooking.userservice.entity.User;
import com.ticketbooking.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        return toDTO(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return toDTO(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email)));
    }

    @Override
    public UserDTO getProfile(String email) {
        return userRepository.findByEmail(email)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        return toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        if (request.getName() != null && !request.getName().isBlank()) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        return toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        userRepository.findByEmail(userDTO.getEmail()).ifPresent(u -> { throw new IllegalStateException("User already exists: " + u.getEmail()); });
        User user = User.builder()
                .id(userDTO.getId())
                .email(userDTO.getEmail())
                .name(userDTO.getName())
                .phone(userDTO.getPhone())
                .address(userDTO.getAddress())
                .dateOfBirth(userDTO.getDateOfBirth())
                .role(userDTO.getRole() != null ? userDTO.getRole() : "CUSTOMER")
                .build();
        return toDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId()).name(user.getName()).email(user.getEmail())
                .phone(user.getPhone()).address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth()).role(user.getRole())
                .createdAt(user.getCreatedAt()).build();
    }
}

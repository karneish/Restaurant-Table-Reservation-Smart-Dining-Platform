package com.ticketbooking.userservice.controller;

import com.ticketbooking.common.dto.UserDTO;
import com.ticketbooking.common.response.APIResponse;
import com.ticketbooking.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile management APIs")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users (Admin)")
    public ResponseEntity<APIResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(APIResponse.success("Users fetched", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<APIResponse<UserDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponse.success("User fetched", userService.getUserById(id)));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email")
    public ResponseEntity<APIResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(APIResponse.success("User fetched", userService.getUserByEmail(email)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<APIResponse<UserDTO>> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(APIResponse.success("User updated", userService.updateUser(id, userDTO)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user (Admin)")
    public ResponseEntity<APIResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(APIResponse.success("User deleted", null));
    }
}

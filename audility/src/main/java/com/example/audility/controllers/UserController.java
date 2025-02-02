package com.example.audility.controllers;

import com.example.audility.entities.User;
import com.example.audility.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Register a new user", description = "Registers a new user with the provided details.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        if (userService.isUserExist(user.getUsername())) {
            return ResponseEntity.status(409).build();  // Conflict error if user exists
        }
        user.setPassword(encoder.encode(user.getPassword()));
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Map<String, Object> tokens = userService.authenticateUser(user);
        if (tokens == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(tokens);
    }


    @GetMapping("/admin")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/admin/validate/{userId}")
    public ResponseEntity<Void> validateUser(@PathVariable Long userId) {
        userService.validateUser(userId);
        return ResponseEntity.ok().build();
    }
    
    
    @PutMapping("/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        Optional<User> existingUser = userService.getUserById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
            if (updatedUser.getCountry() != null) user.setCountry(updatedUser.getCountry());
            if (updatedUser.getState() != null) user.setState(updatedUser.getState());
            if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
            if (updatedUser.getStreet() != null) user.setStreet(updatedUser.getStreet());
            if (updatedUser.getPostalCode() != null) user.setPostalCode(updatedUser.getPostalCode());
            if (updatedUser.getDob() != null) user.setDob(updatedUser.getDob());

            User savedUser = userService.updateUser(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<User> adminUpdateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        Optional<User> existingUser = userService.getUserById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());

            User savedUser = userService.updateUser(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        boolean deleted = userService.deleteUser(userId);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

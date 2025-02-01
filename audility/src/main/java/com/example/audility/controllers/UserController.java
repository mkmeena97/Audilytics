package com.example.audility.controllers;

import com.example.audility.entities.User;
import com.example.audility.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

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
	public Map<String, String> login(@RequestBody User user) {
		return userService.authenticateUser(user);
	}


    @GetMapping("/admin")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/admin/validate/{userId}")
    public ResponseEntity<Void> validateUser(@PathVariable Long userId) {
        userService.validateUser(userId);
        return ResponseEntity.ok().build();
    }
}

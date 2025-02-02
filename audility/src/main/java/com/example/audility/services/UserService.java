package com.example.audility.services;

import com.example.audility.entities.User;
import com.example.audility.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;
    
    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public boolean isUserExist(String username) {
        return userRepository.existsUserByUsername(username);
    }

    public Map<String, Object> authenticateUser(User user) {

        String credential = user.getUsername();

        if (user.getPhone() != null && !user.getPhone().isEmpty()) {
            credential = user.getPhone();
        } else if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            credential = user.getEmail();
        }

        User fullUser = userRepository.findByUsernameOrEmailOrPhone(credential, credential, credential)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("User found: " + fullUser);

        // Authenticate using Spring Security's AuthenticationManager
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(credential, user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateAccessToken(fullUser);
            String refreshToken = jwtService.generateRefreshToken(fullUser);

            // Create a response map with user details and tokens
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);


            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", fullUser.getId());
            userDetails.put("username", fullUser.getUsername());
            userDetails.put("firstName", fullUser.getFirstName());
            userDetails.put("lastName", fullUser.getLastName());
            userDetails.put("email", fullUser.getEmail());
            userDetails.put("phone", fullUser.getPhone());
            userDetails.put("role", fullUser.getRole());
            userDetails.put("country", fullUser.getCountry());
            userDetails.put("state", fullUser.getState());
            userDetails.put("city", fullUser.getCity());
            userDetails.put("street", fullUser.getStreet());
            userDetails.put("date_of_birth", fullUser.getDob());

            response.put("user", userDetails);

            return response;
        }

        throw new RuntimeException("Login Failed");
    }



    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void validateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setValidated(true);
        userRepository.save(user);
    }


    public User updateUser(User user) {
        return userRepository.save(user);
    }


    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }


    public boolean deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
}


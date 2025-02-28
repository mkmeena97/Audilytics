package com.example.audility.repositories;

import com.example.audility.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsUserByUsername(String username);

    Optional<User> findByUsernameOrEmailOrPhone(String username, String email, String phone);
}
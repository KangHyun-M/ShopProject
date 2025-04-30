package com.example.shopback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopback.entity.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByUsername(String username);

    Optional<EmailVerification> findByUsernameAndVerificationCode(String username, String verificationCode);
}

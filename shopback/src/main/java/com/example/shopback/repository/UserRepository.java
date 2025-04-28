package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopback.entity.User;

public interface UserRepository extends JpaRepository<User,Long> {
    
    User findByUsername(String username);
}

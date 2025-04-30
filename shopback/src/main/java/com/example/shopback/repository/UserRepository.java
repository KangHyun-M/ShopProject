package com.example.shopback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopback.entity.User;


public interface UserRepository extends JpaRepository<User,Long> {
    
    //이메일으로 사용자찾기
    Optional<User> findByUsername(String username);

    //닉네임으로 사용자찾기
    Optional<User> findByUsernic(String usernic);

    //이메일 중복확인
    boolean existsByUsername(String username);

    //닉네임 중복확인
    boolean existsByUsernic(String usernic);
}

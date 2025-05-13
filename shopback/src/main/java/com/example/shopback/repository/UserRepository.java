package com.example.shopback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shopback.entity.User;


public interface UserRepository extends JpaRepository<User,Long> {
    
    //이메일으로 사용자찾기     メールアドレスからユーザーを照会
    Optional<User> findByUsername(String username);

    //닉네임으로 사용자찾기     ニックネームからユーザーを照会
    Optional<User> findByUsernic(String usernic);

    //이메일 중복확인           メールアドレスの重複確認
    boolean existsByUsername(String username);

    //닉네임 중복확인           ニックネームの重複確認
    boolean existsByUsernic(String usernic);

    // 주소까지 함께 불러오는 메서드
    @EntityGraph(attributePaths = "address")
    Optional<User> findWithAddressByUsername(String username);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders o LEFT JOIN FETCH o.orderAddress WHERE u.username = :username")
    Optional<User> findWithOrdersByUsername(@Param("username") String username);
}

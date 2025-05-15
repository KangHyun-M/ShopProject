package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 사용자 이메일(username)로 주문 내역을 조회
    // ユーザーのメールアドレス(username)で注文履歴を取得
    List<Order> findByUser_Username(String username);
}

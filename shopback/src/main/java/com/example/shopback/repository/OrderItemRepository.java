package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{
    
}

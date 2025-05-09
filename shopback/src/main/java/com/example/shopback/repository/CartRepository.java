package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long>{
    List<CartItem> findByUser_Id(Long userId);
}

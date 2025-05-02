package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{
    
    //상품Id로 상품조회
    Item findById(long id);
}

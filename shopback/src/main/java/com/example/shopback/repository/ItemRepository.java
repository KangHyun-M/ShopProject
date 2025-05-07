package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.Item;
import java.util.List;


@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{
    
    //카테고리별로 상품조회
    List<Item> findByCategory(String category);
}

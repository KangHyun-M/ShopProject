package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.Item;


@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{
    
    //삭제 안된 상품 카테고리별로 조회
    List<Item> findByCategoryAndDeletedFalse(String category);

    // 삭제되지 않은 상품 전체 조회
    List<Item> findByDeletedFalse();
    
    // 삭제된 상품만 조회
    List<Item> findByDeletedTrue();
}

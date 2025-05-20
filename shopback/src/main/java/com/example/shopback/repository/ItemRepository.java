package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    // 削除されていない商品をカテゴリ別に取得
    List<Item> findByCategoryAndDeletedFalse(String category);

    // 削除されていない全ての商品を取得
    List<Item> findByDeletedFalse();
    
    // 削除済みの商品だけを取得
    List<Item> findByDeletedTrue();
}

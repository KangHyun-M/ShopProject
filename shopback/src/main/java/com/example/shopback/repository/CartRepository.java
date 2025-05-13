package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long>{
    //List<CartItem> findByUser_Id(Long userId);

    //List<CartItem> findByUser_IdAndDeletedFalse(Long userId);

    @Query("SELECT c FROM CartItem c JOIN FETCH c.item i WHERE c.user.id = :userId AND c.deleted = false AND i.deleted = false")
    List<CartItem> fetchActiveCartItemsWithValidItem(@Param("userId") Long userId);
}

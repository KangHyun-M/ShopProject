package com.example.shopback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

    // ユーザーのカートに存在するアクティブな商品（削除されていない）を取得
    @Query("SELECT c FROM CartItem c JOIN FETCH c.item i WHERE c.user.id = :userId AND c.deleted = false AND i.deleted = false")
    List<CartItem> fetchActiveCartItemsWithValidItem(@Param("userId") Long userId);

    // 指定されたIDリストに基づいて、ユーザーのカートアイテムと商品情報（画像含む）を取得
    @Query("SELECT c FROM CartItem c JOIN FETCH c.item i LEFT JOIN FETCH i.itemImgs WHERE c.id IN :ids AND c.user.id = :userId")
    List<CartItem> findByIdInAndUserId(@Param("ids") List<Long> ids, @Param("userId") Long userId);
}

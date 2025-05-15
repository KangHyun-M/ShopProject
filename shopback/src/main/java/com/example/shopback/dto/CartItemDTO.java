package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {

    private Long cartItemId;    // カートアイテムID（主キー）

    private Long itemId;        // 商品ID（参照）

    private String itemName;    // 商品名

    private String description; // 商品説明

    private int price;          // 単価（価格）

    private int quantity;       // 購入数量

    private String imgUrl;      // 商品の画像URL（代表画像）
}

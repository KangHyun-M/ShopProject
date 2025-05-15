package com.example.shopback.dto;

import lombok.Data;

@Data
public class CartRequestDTO {

    private Long itemId;   // 商品ID（追加する商品）

    private int quantity;  // 数量（追加する個数）
}

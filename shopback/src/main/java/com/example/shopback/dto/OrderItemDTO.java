package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemDTO {

    private String itemName;   // 商品名

    private int quantity;      // 注文数量

    private int price;         // 単価（注文時の価格）

    private String imgPath;    // 商品画像のパス（代表画像）

    private Long itemId;       // 商品ID（商品詳細ページなどで使用）
}

package com.example.shopback.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {

    public Long orderId;                      // 注文ID

    public List<OrderItemDTO> items;          // 注文された商品のリスト

    public LocalDateTime orderAt;             // 注文日時

    public String deliveryZip;                // 配送先の郵便番号

    public String deliveryAddr;               // 配送先の住所
}

package com.example.shopback.dto;

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
public class OrderRequestDTO {

    private List<Long> cartItemIds; // カート内の商品IDリスト（注文対象）

    private String zipcode;         // 配送先の郵便番号

    private String address;         // 配送先の住所
}

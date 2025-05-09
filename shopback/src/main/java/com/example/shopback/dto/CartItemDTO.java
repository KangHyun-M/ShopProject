package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    
    private Long cartItemId;
    private Long itemId;
    private String itemName;
    private String description;
    private int price;
    private int quantity;
    private String imgUrl;
}

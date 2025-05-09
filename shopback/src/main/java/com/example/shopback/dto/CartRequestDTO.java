package com.example.shopback.dto;

import lombok.Data;

@Data
public class CartRequestDTO {
    
    private Long itemId;
    private int quantity;
}

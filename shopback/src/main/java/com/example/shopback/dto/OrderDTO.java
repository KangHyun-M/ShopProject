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
    public Long orderId;
    public List<OrderItemDTO> items;
    public LocalDateTime orderAt;
    public String deliveryZip;
    public String deliveryAddr;
}

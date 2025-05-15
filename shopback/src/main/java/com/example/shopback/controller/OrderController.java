package com.example.shopback.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.OrderDTO;
import com.example.shopback.dto.OrderRequestDTO;
import com.example.shopback.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    // 🛒 注文処理（カートから選択した商品を注文）
    @PostMapping("/user/orders")
    public ResponseEntity<String> orderItems(@RequestBody OrderRequestDTO requestDTO, Principal principal) {
        String username = principal.getName();
        orderService.placeOrder(username, requestDTO);
        return ResponseEntity.ok("注文が完了しました");
    }

    // 📋 注文履歴取得（ログインユーザーの注文一覧）
    @GetMapping("/user/orders")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(Principal principal) {
        String username = principal.getName();
        List<OrderDTO> orderList = orderService.getOrderList(username);
        return ResponseEntity.ok(orderList);
    }

    // ❌ 管理者による注文キャンセル（注文ID指定）
    @DeleteMapping("/admin/orders/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("注文キャンセル完了");
    }
}

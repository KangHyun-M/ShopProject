package com.example.shopback.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.shopback.dto.OrderDTO;
import com.example.shopback.dto.OrderItemDTO;
import com.example.shopback.dto.OrderRequestDTO;
import com.example.shopback.entity.CartItem;
import com.example.shopback.entity.Item;
import com.example.shopback.entity.ItemImg;
import com.example.shopback.entity.Order;
import com.example.shopback.entity.OrderAddress;
import com.example.shopback.entity.OrderItem;
import com.example.shopback.entity.User;
import com.example.shopback.repository.CartRepository;
import com.example.shopback.repository.OrderRepository;
import com.example.shopback.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    // 注文処理 
    @Transactional
    public void placeOrder(String username, OrderRequestDTO request) {
        // ユーザー取得（住所付き）
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        List<OrderItem> orderItems = new ArrayList<>();

        // カート商品を注文商品に変換
        for (Long cartItemId : request.getCartItemIds()) {
            CartItem cartItem = cartRepository.findById(cartItemId)
                    .orElseThrow(() -> new RuntimeException("カート商品が見つかりません"));

            if (!cartItem.getUser().equals(user)) {
                throw new RuntimeException("他人のカートです");
            }

            // 注文商品エンティティ生成
            OrderItem orderItem = OrderItem.builder()
                    .item(cartItem.getItem())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getItem().getPrice())
                    .build();

            orderItems.add(orderItem);

            // カート商品は削除扱いに変更（論理削除）
            cartItem.setDeleted(true);
            cartItem.setModifiedAt(LocalDateTime.now());
        }

        // 配送先情報エンティティ生成
        OrderAddress orderAddress = OrderAddress.builder()
                .zipcode(request.getZipcode())
                .address(request.getAddress())
                .build();

        // 注文エンティティ生成
        Order order = Order.builder()
                .user(user)
                .orderItems(orderItems)
                .orderAt(LocalDateTime.now())
                .orderAddress(orderAddress)
                .build();

        // 双方向関連設定（注文⇄住所）
        orderAddress.setOrder(order);

        // 注文商品に注文情報を設定
        order.getOrderItems().forEach(item -> item.setOrder(order));

        // 注文保存
        orderRepository.save(order);
    }

    // 注文履歴を取得
    public List<OrderDTO> getOrderList(String username) {
        // ユーザー取得（注文情報付き）
        User user = userRepository.findWithOrdersByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        return user.getOrders().stream()
                .map(order -> {
                    OrderAddress orderAddress = order.getOrderAddress();
                    String zip = orderAddress != null ? orderAddress.getZipcode() : "";
                    String addr = orderAddress != null ? orderAddress.getAddress() : "";

                    // 注文商品のDTO変換
                    List<OrderItemDTO> items = order.getOrderItems().stream()
                            .map(oi -> {
                                Item item = oi.getItem();
                                Optional<ItemImg> mainImg = item.getItemImgs().stream()
                                        .filter(ItemImg::getMainImg)
                                        .findFirst();

                                return OrderItemDTO.builder()
                                        .itemName(item.getItemname())
                                        .price(oi.getPrice())
                                        .quantity(oi.getQuantity())
                                        .imgPath(mainImg.map(ItemImg::getImgPath).orElse(null))
                                        .itemId(item.getId())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return OrderDTO.builder()
                            .orderId(order.getId())
                            .orderAt(order.getOrderAt())
                            .deliveryZip(zip)
                            .deliveryAddr(addr)
                            .items(items)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 注文キャンセル処理
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("注文が見つかりません"));

        orderRepository.delete(order);
    }
}

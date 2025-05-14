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

    @Transactional
    public void placeOrder(String username, OrderRequestDTO request) {
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        List<OrderItem> orderItems = new ArrayList<>();

        for (Long cartItemId : request.getCartItemIds()) {
            CartItem cartItem = cartRepository.findById(cartItemId)
                    .orElseThrow(() -> new RuntimeException("カート商品が見つかりません"));

            if (!cartItem.getUser().equals(user)) {
                throw new RuntimeException("他人のカートです");
            }

            OrderItem orderItem = OrderItem.builder()
                    .item(cartItem.getItem())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getItem().getPrice())
                    .build();

            orderItems.add(orderItem);

            // 카트 아이템 soft delete 처리
            cartItem.setDeleted(true);
            cartItem.setModifiedAt(LocalDateTime.now());
        }

        // 주소 엔티티 생성
        OrderAddress orderAddress = OrderAddress.builder()
                .zipcode(request.getZipcode())
                .address(request.getAddress())
                .build();

        // 주문 생성
        Order order = Order.builder()
                .user(user)
                .orderItems(orderItems)
                .orderAt(LocalDateTime.now())
                .orderAddress(orderAddress)
                .build();

        //양방향 연관관계 설정
        orderAddress.setOrder(order);

        // 주문 아이템에도 order 설정
        order.getOrderItems().forEach(item -> item.setOrder(order));

        // 저장
        orderRepository.save(order);
    }


    public List<OrderDTO> getOrderList(String username) {
        User user = userRepository.findWithOrdersByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        return user.getOrders().stream()
                .map(order -> {
                        OrderAddress orderAddress = order.getOrderAddress();
                        String zip = orderAddress != null ? orderAddress.getZipcode() : "";
                        String addr = orderAddress != null ? orderAddress.getAddress() : "";

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
    
     @Transactional
     public void cancelOrder(Long orderId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("注文が見つかりません"));

        orderRepository.delete(order);
     }
}

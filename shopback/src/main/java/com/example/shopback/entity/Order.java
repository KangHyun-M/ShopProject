package com.example.shopback.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id; // 注文ID（主キー）

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 注文をしたユーザー（多対一）

    // 注文された商品リスト（注文アイテムと1対多の関係）
    @Column(name = "order_items")
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @Column(name = "order_date_time")
    private LocalDateTime orderAt; // 注文日時

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "orderAddr_id")
    private OrderAddress orderAddress; // 配送先住所（1対1）

    @Builder.Default
    @Column(name = "order_cancel", nullable = false)
    private boolean cancle = false; // 注文キャンセルフラグ（false: 正常, true: キャンセル済）

    // 注文商品を追加し、逆側の関連付けも設定
    public void addOrderItem(OrderItem orderItem){
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
}

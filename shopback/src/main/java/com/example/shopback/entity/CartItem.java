package com.example.shopback.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//  カートに追加された商品情報を表すエンティティ
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "CartItem")
public class CartItem {
    
    //  カート項目ID（主キー、オートインクリメント）
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long id;

    //  カートを所有するユーザー（外部キー）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // ユーザーテーブルとのマッピング
    private User user;

    //  カートに追加された商品（外部キー）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id") // 商品テーブルとのマッピング
    private Item item;

    //  購入数量
    @Column(name = "quantity")
    private int quantity;

    //  カートに追加された日時
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    //  最終更新日時
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    //  削除されたかどうか（ソフトデリート）
    @Builder.Default
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
}

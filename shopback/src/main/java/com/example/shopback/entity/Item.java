package com.example.shopback.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// ✅ 商品情報を表すエンティティ
@Entity
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Item")
public class Item {
    
    // ✅ 商品ID（主キー、オートインクリメント）
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    // ✅ 商品名
    @Column(name = "item_name")
    private String itemname;

    // ✅ 商品の説明文
    @Column(name = "item_description")
    private String description;

    // ✅ 商品価格（単位: 円）
    @Column(name = "item_price")
    private int price;

    // ✅ カテゴリー（例: CPU, GPU など）
    @Column(name = "category")
    private String category;

    // ✅ 登録日時（デフォルト：現在時刻）
    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // ✅ 更新日時（デフォルト：現在時刻）
    @Column(name = "modified_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime modifiedAt;

    // ✅ 削除フラグ（true の場合は論理削除済）
    @Builder.Default
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    // ✅ 商品に紐づく画像リスト（1対多）
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItemImg> itemImgs = new ArrayList<>();
}

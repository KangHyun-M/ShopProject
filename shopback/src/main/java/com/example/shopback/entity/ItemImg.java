package com.example.shopback.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// ✅ 商品画像を管理するエンティティ
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Item_Thum") // 📌 テーブル名：サムネイル情報
public class ItemImg {

    // ✅ 主キー（画像ID）
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "img_id")
    private Long img_id;

    // ✅ 画像の保存パス（例: /images/item1.png）
    @Column(name = "img_path", nullable = false)
    private String imgPath;

    // ✅ 商品とのリレーション（多対一）Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    // ✅ 登録日時（デフォルト：現在時刻）
    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // ✅ 更新日時（デフォルト：現在時刻）
    @Column(name = "modified_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime modifiedAt;

    // ✅ メイン画像フラグ（trueの場合、代表画像として使用）
    @Column(name = "main_img", nullable = false)
    private Boolean mainImg;
}

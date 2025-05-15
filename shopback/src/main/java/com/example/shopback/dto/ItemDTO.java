package com.example.shopback.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {

    private Long id;                    // 商品ID

    private String itemname;           // 商品名（アイテム名）

    private String description;        // 商品説明（詳細内容）

    private int price;                 // 価格（単価）

    private String category;           // カテゴリ（例: CPU, GPUなど）

    private LocalDateTime createdAt;   // 登録日時

    private LocalDateTime modifiedAt;  // 最終更新日時

    private Integer mainImg;           // メイン画像インデックス（フロント側で使用）

    private List<String> imagePaths;   // 商品画像のURLリスト（表示用）
}

package com.example.shopback.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemUpdateDTO {

    private String itemname;              // 商品名（アイテム名）

    private String description;           // 商品の説明（詳細）

    private int price;                    // 価格（単価）

    private String category;              // カテゴリ（例：CPU、GPU）

    private List<String> remainImg;       // 削除されない既存の画像パス（そのまま残す画像）

    private String mainImgPath;           // メイン画像として使用する画像のパス
}

package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long id;           // 住所ID（主キー）

    private String zipcode;    // 郵便番号

    private String address;    // 住所の内容（都道府県＋市区町村など）

    private boolean isMain;    // メイン住所かどうか（true: メイン住所）
}

package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserDTO {

    private String username;           // ID（メールアドレス）
    private String password;           // パスワード
    private String confirmPass;        // パスワード再確認用
    private String verificationCode;   // 認証コード（メール認証）
    private String usernic;            // ニックネーム
    private String role;               // 権限（例: USER, ADMIN）

    private String address;            // 代表住所（オプション）
    private String zipcode;            // 郵便番号（オプション）
}

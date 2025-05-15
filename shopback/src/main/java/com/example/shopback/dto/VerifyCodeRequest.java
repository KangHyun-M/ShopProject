package com.example.shopback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VerifyCodeRequest {

    private String username;            // ユーザーのメールアドレス（認証対象）
    private String verificationCode;    // 入力された認証コード
}

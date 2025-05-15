package com.example.shopback.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequestDTO {

    private Long id;                    // ユーザーID（PK）
    private String username;           // メールアドレス（ログインID）
    private String usernic;            // ニックネーム
    private List<OrderDTO> orders;     // 注文履歴リスト
}

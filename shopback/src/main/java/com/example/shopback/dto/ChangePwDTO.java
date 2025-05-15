package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePwDTO {
    private String currentPassword; // 現在のパスワード
    private String newPassword;     // 新しいパスワード
}

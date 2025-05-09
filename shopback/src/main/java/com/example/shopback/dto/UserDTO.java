package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserDTO {
    
    private String username;    //아이디                ID
    private String password;    //비밀번호              安心番号/パスワード
    private String confirmPass; //비밀번호 재확인용     安心番号/パスワード再確認
    private String verificationCode; //인증번호         認証番号
    private String usernic;     //닉네임                ニックネーム
    private String role;        //권한                  権限

}

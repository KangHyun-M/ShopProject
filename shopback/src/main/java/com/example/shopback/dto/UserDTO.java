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
    
    private String username;    //아이디
    private String password;    //비밀번호
    //private String confirmPass; //비밀번호 재확인용
    private String role;        //권한한

}

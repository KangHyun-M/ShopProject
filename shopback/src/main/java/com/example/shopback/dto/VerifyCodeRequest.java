package com.example.shopback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class VerifyCodeRequest {
    private String username;
    private String verificationCode;
}

package com.example.shopback.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerifyCodeService emailVerifyCodeService;

    public void sendVerificationEmail(String username){
        //인증번호 생성
        String verificationCode = generateVerificationCode();

        //DB에 인증번호 저장
        emailVerifyCodeService.sendVerificationCode(username, verificationCode);

        //이메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(username);
        message.setSubject("이메일 인증번호");
        message.setText("인증번호: " + verificationCode);
        mailSender.send(message);
    }

    private String generateVerificationCode(){
        return String.format("06d%", (int)(Math.random()*1000000));
    }
}

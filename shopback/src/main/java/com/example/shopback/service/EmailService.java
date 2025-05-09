package com.example.shopback.service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender javaMailSender;

    public String sendVerificationCode(String code){
        String verificationCode = generateCode();
        String subject ="認証番号";
        String message = "認証番号は " + verificationCode + "です";

        sendCode(code,subject,message);
        return verificationCode;
    }

    public void sendCode(String recipient, String subject, String text){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(text);
            javaMailSender.send(message);
        } catch (MailException e) {
            throw new RuntimeException("メール送信中にエラー発生しました", e);
        }
    }

    // メール認証コードを保存　、メモリーに保存する
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();


    // 인증번호 검증    パスワード/安心番号を検証
    public boolean verifyCode(String username, String inputCode) {
        String savedCode = verificationCodes.get(username);
        return savedCode != null && savedCode.equals(inputCode);
    }

    public String generateCode() {
        try {
            int codeLength = 6;
            String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            StringBuilder sb = new StringBuilder(codeLength);
            Random random = new SecureRandom();
    
            for (int i = 0; i < codeLength; i++) {
                int index = random.nextInt(alphabet.length());
                char randomChar = alphabet.charAt(index);
                sb.append(randomChar);
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("認証番号生成中にエラー発生しました", e);
        }
    }
}

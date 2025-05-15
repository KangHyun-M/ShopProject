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

    /**
     * 認証コードを生成して送信する
     * @param code メールアドレス
     * @return 発行した認証コード
     */
    public String sendVerificationCode(String code){
        String verificationCode = generateCode();
        String subject = "認証番号";
        String message = "認証番号は " + verificationCode + " です";

        sendCode(code, subject, message);
        return verificationCode;
    }

    /**
     * メール送信処理
     * @param recipient 送信先
     * @param subject 件名
     * @param text メッセージ本文
     */
    public void sendCode(String recipient, String subject, String text){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(text);
            javaMailSender.send(message);
        } catch (MailException e) {
            throw new RuntimeException("メール送信中にエラーが発生しました", e);
        }
    }

    // 認証コードをメモリに保存（ユーザーごとに管理）
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    /**
     * 認証コードを検証する
     * @param username メールアドレス
     * @param inputCode 入力された認証コード
     * @return 正しければ true、不正なら false
     */
    public boolean verifyCode(String username, String inputCode) {
        String savedCode = verificationCodes.get(username);
        return savedCode != null && savedCode.equals(inputCode);
    }

    /**
     * 認証コードをランダム生成（英字6文字）
     * @return 認証コード
     */
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
            throw new RuntimeException("認証番号生成中にエラーが発生しました", e);
        }
    }

    /**
     * 仮パスワードをメールで送信
     * @param recipient メールアドレス
     * @param tempPassword 仮パスワード
     */
    public void sendTempPassword(String recipient, String tempPassword) {
        String subject = "仮パスワードのご案内";
        String text = "以下があなたの仮パスワードです：\n" + tempPassword + "\nログイン後、すぐにパスワードを変更してください。";

        sendCode(recipient, subject, text);
    }
}

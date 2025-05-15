package com.example.shopback.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.shopback.dto.VerifyCodeRequest;
import com.example.shopback.service.EmailService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class EmailController {

    private final EmailService emailService;

    // 📩 認証番号を送信し、セッションに保存
    @PostMapping("/send-auth")
    public ResponseEntity<Void> sendAuth(@RequestParam("username") String username, HttpSession session) {
        // 認証コードを生成してメール送信
        String verificationCode = emailService.sendVerificationCode(username);

        // セッションに保存（後で照合するため）
        session.setAttribute("verificationCode", verificationCode);

        return ResponseEntity.ok().build();
    }

    // ✅ 入力された認証コードをセッションのコードと比較
    @PostMapping("/verify-code")
    public ResponseEntity<Boolean> verifyCode(@RequestBody VerifyCodeRequest request, HttpSession session) {
        String sessionCode = (String) session.getAttribute("verificationCode");

        boolean result = sessionCode != null && sessionCode.equals(request.getVerificationCode());

        // 検証に成功した場合、セッションに認証状態とメールを保存
        if (result) {
            session.setAttribute("resetVerified", true);
            session.setAttribute("resetEmail", request.getUsername());
        }

        return ResponseEntity.ok(result);
    }

}

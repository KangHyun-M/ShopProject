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

    

    @PostMapping("/send-auth")
    public ResponseEntity<Void> sendAuth(@RequestParam("username") String username, HttpSession session){
        String verificationCode = emailService.sendVerificationCode(username);
        session.setAttribute("verificationCode", verificationCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-code")
        public ResponseEntity<Boolean> verifyCode(@RequestBody VerifyCodeRequest request,
                                            HttpSession session) {
        String sessionCode = (String) session.getAttribute("verificationCode");

        boolean result = sessionCode != null && sessionCode.equals(request.getVerificationCode());

        return ResponseEntity.ok(result);
    }
}

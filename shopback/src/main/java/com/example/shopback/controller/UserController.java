package com.example.shopback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.UserDTO;
import com.example.shopback.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    
    //회원가입  会員登録
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO){
        try{
            //회원가입처리  会員登録処理
            userService.signUp(userDTO);

            //회원가입 완료 메세지 반환 会員登録完了後、完了メッセージ返還
            return ResponseEntity.ok("会員登録完了");
        } catch (Exception e){
            return ResponseEntity.status(500).body("会員登録中、エラーが発生しました");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody UserDTO userDTO, HttpServletRequest request, HttpServletResponse response) {
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();
    
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    
            if (passwordEncoder.matches(password, userDetails.getPassword())) {
                // 인증 성공 시 Authentication 객체 생성    認証に成功してからAuthentication客体生成
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
    
                // SecurityContext에 저장   SecurityContextに貯蔵
                SecurityContextHolder.getContext().setAuthentication(authentication);
    
                //세션에 SecurityContext 저장 (쿠키 발급 핵심 부분) セッションにSecurityContext貯蔵（クッキー発給の核心）
                request.getSession(true).setAttribute(
                    "SPRING_SECURITY_CONTEXT",
                    SecurityContextHolder.getContext()
                );
    
                System.out.println("ログイン成功 - ID: " + username);
                return ResponseEntity.ok("ログイン成功");
            } else {
                System.out.println("ログイン失敗 - 安心番号不一致: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ID又は安心番号不一致");
            }
        } catch (Exception e) {
            System.err.println("ログイン中にエラーが発生しました: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("サーバーエラー");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            // 세션 만료 처리   セッションの満了処理
            request.getSession().invalidate();
            return ResponseEntity.ok("ログアウト成功");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("ログアウト中にエラー発生しました");
        }
    }

    @PostMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestBody UserDTO userDTO){
        String username = userDTO.getUsername();
        boolean exists = userService.checkUsernameExists(username);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/check-usernic")
    public ResponseEntity<Boolean> checkUsernic(@RequestBody UserDTO userDTO){
        String usernic = userDTO.getUsernic();
        boolean exists = userService.checkUsernicExists(usernic);
        return ResponseEntity.ok(exists);
    }
    
    //현재 로그인한 사용자 정보 반환
    // @GetMapping("/me")
    // public UserDTO getCurrentUser(Authentication auth){
    //     //Authentication 객체에서 사용자 정보 가져오기
    //      UserDetails userDetails = (UserDetails) auth.getPrincipal();

    //      //CustomUserDetails에서 사용자 정보 가져오고 DTO로 변환
    //      String username = userDetails.getUsername();
    //      return userService.findByUsername(username);
    // }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            UserDTO userDto = userService.findByUsername(username);
            if (userDto != null) {
                return ResponseEntity.ok(userDto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
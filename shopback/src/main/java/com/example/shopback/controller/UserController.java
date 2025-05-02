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

    
    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO){
        try{
            //회원가입처리
            userService.signUp(userDTO);

            //회원가입 완료 메세지 반환
            return ResponseEntity.ok("회원가입 완료");
        } catch (Exception e){
            return ResponseEntity.status(500).body("회원가입중 오류가 발생했습니다");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody UserDTO userDTO, HttpServletRequest request, HttpServletResponse response) {
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();
    
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    
            if (passwordEncoder.matches(password, userDetails.getPassword())) {
                // 인증 성공 시 Authentication 객체 생성
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
    
                // SecurityContext에 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
    
                // ✅ 세션에 SecurityContext 저장 (쿠키 발급 핵심 부분)
                request.getSession(true).setAttribute(
                    "SPRING_SECURITY_CONTEXT",
                    SecurityContextHolder.getContext()
                );
    
                System.out.println("로그인 성공 - 아이디: " + username);
                return ResponseEntity.ok("로그인 성공");
            } else {
                System.out.println("로그인 실패 - 비밀번호 불일치: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 틀렸습니다.");
            }
        } catch (Exception e) {
            System.err.println("로그인 처리 중 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            // 세션 만료 처리
            request.getSession().invalidate();
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("로그아웃 처리 중 오류 발생");
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
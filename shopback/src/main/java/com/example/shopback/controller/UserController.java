package com.example.shopback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO){
        try{
            //회원가입 처리
            userService.signUp(userDTO);
            return ResponseEntity.ok("회원가입 성공!");
        }
        catch (IllegalArgumentException e){
            //비밀번호 불일치와 같은 오류 발생시
            return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
        }
        catch (Exception e){
            //다른 예외 발생시
            return ResponseEntity.status(500).body("예기치못한 오류 발생");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody UserDTO userDTO, HttpServletRequest request, HttpServletResponse response){
        try{
            boolean isAuthenticated = userService.authenticate(userDTO.getUsername(), userDTO.getPassword());

            if(isAuthenticated){
                //세션에 유저 정보 저장
                request.getSession().setAttribute("username", userDTO.getUsername());
                
                return ResponseEntity.ok("로그인 성공");
            } else{
                return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다.");
            }
        } catch (Exception e){
            return ResponseEntity.status(500).body("서버에러");
        }
    }
}

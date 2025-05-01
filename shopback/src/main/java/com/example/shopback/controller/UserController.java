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
            //회원가입처리
            userService.signUp(userDTO);

            //회원가입 완료 메세지 반환
            return ResponseEntity.ok("회원가입 완료");
        } catch (Exception e){
            return ResponseEntity.status(500).body("회원가입중 오류가 발생했습니다");
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
    

}

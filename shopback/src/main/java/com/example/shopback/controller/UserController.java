package com.example.shopback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.UserDTO;
import com.example.shopback.service.EmailService;
import com.example.shopback.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO, @RequestParam String verificationCode){
        try{
            //이메일 인증번호 확인
            if(!userService.verifyCode(userDTO.getUsername(), verificationCode)){
                return ResponseEntity.status(400).body("인증번호가 일치하지 않거나 만료되었습니다");
            }

            //회원가입처리
            userService.signUp(userDTO, verificationCode);

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

    //아이디(이메일) 중복확인
    @PostMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestBody String username){
        boolean exists = userService.checkUsernameExists(username);
        return ResponseEntity.ok(exists);
    }

    //인증번호 발송
    @PostMapping("/send-auth")
    public ResponseEntity<String> sendCode(@RequestBody UserDTO userDTO){
        try{
            //이메일 인증번호 발송
            emailService.sendVerificationEmail(userDTO.getUsername());

            //인증번호 발송 완료 메세지
            return ResponseEntity.ok("인증번호가 발송되었습니다. 인증번호를 입력해주세요");
        } catch (Exception e){
            return ResponseEntity.status(500).body("이메일 발송중 오류가 발생했습니다");
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestParam String username, @RequestParam String verificationCode){
        try{
            //인증번호 확인
            boolean isVerified = userService.verifyCode(username, verificationCode);

            if(isVerified){
                return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
            } else{
                return ResponseEntity.status(400).body("인증번호가 일치하지 않습니다");
            }
        } catch(Exception e){
            return ResponseEntity.status(500).body("인증번호 확인중 오류가 발생했습니다");
        }
    }

    @PostMapping("/check-usernic")
    public ResponseEntity<Boolean> checkUsernic(@RequestBody String usernic){
        boolean exists = userService.checkUsernicExists(usernic);
        return ResponseEntity.ok(exists);
    }
    

}

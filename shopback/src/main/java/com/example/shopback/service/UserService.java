package com.example.shopback.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shopback.componant.Role;
import com.example.shopback.dto.UserDTO;
import com.example.shopback.entity.User;
import com.example.shopback.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    

    //회원가입 처리
    public void signUp(UserDTO userDTO) {
        //비밀번호 확인 로직
        // if(!userDTO.getPassword().equals(userDTO.getConfirmPass())){
        //     throw new IllegalArgumentException("패스워드가 일치하지 않습니다.");
        // }

        //비밀번호 인코딩후 엔티티생성
        User user = toEntity(userDTO);
        user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.valueOf(userDTO.getRole())); //Role을 Enum으로 변환
        userRepository.save(user); //DB에 저장
    }

    //DTO를 Entity로
    private User toEntity(UserDTO userDTO){
        return User.builder()
            .username(userDTO.getUsername())
            .password(userDTO.getPassword())
            .role(Role.valueOf(userDTO.getRole()))
            .build();
    }

    //Entity를 DTO로로
    private UserDTO toDTO(User user){
        return UserDTO.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .role(user.getRole().name())    //Role을 String으로 변환
            .build();
    }

    //저장되어있는 비밀번호하고 입력한 비밀번호 비교
    public boolean matchPass(String rawPass, String encodedPass){
        return bCryptPasswordEncoder.matches(rawPass, encodedPass);
    }
    
    //회원가입 할 때 유저 정보 조회
    public UserDTO findByUsername(String username){
        User user = userRepository.findByUsername(username);
        if(user != null){
            return toDTO(user);
        }
        return null;
    }

    //사용자 인증
    public boolean authenticate(String username, String password){
        User user = userRepository.findByUsername(username);

        if(user == null){
            System.out.println("로그인 실패: 아이디 존재 안 함");
            return false;
        }

        if(!matchPass(password, user.getPassword())){
            System.out.println("로그인 실패: 비밀번호 틀림");
            return false;
        }

        System.out.println("로그인 성공: " + username);
        return true;
    }
}

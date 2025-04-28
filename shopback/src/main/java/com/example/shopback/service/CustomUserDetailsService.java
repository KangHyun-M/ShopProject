package com.example.shopback.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.shopback.dto.CustomUserDetails;
import com.example.shopback.entity.User;
import com.example.shopback.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        //유저계정 정보를 DB에서 획득
        User user = userRepository.findByUsername(username);

        //유저가 없으면 예외 처리
        if(user != null){
            System.out.println("CustomUserDetailsService : " + user.toString());
            return new CustomUserDetails(user); //엔티티 객체를 CustomUserDetails로 변환
        }

        System.out.println("존재하지 않는 회원입니다회원입니다");
        throw new UsernameNotFoundException("User not found with username : " + username);
    }
    
}

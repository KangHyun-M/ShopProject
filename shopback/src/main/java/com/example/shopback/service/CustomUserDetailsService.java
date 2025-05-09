package com.example.shopback.service;

import java.util.Optional;

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
        // 유저계정 정보를 DB에서 획득 (Optional을 사용)    ユーザーのアカウント情報をデータベースから取得（Optionalを使用）
        Optional<User> optionalUser = userRepository.findByUsername(username);

        // 유저가 없으면 예외 처리      ユーザーが存在しない場合、例外をスローする
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            System.out.println("CustomUserDetailsService : " + user.toString());
            return new CustomUserDetails(user); // 엔티티 객체를 CustomUserDetails로 변환   Entity客体をCustomUserDetailsに変換
        }

        System.out.println("該当するユーザーは存在しません");
        throw new UsernameNotFoundException("該当するユーザーは存在しません : " + username);
    }
    
}

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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // ユーザーアカウント情報をDBから取得（Optional使用）
        Optional<User> optionalUser = userRepository.findByUsername(username);

        // 該当ユーザーが存在する場合、CustomUserDetailsにラップして返却
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            System.out.println("CustomUserDetailsService : " + user.toString());
            return new CustomUserDetails(user); // Entityオブジェクト → CustomUserDetailsに変換
        }

        // ユーザーが存在しない場合、例外をスロー
        System.out.println("該当するユーザーは存在しません");
        throw new UsernameNotFoundException("該当するユーザーは存在しません : " + username);
    }
}

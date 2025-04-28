package com.example.shopback.dto;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.shopback.entity.User;

public class CustomUserDetails implements UserDetails {
    
    
    private User user;

    public CustomUserDetails(User user){
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        //Role enum에서 권한을 가져와서 설정
        //Role Enum을 문자열로 변환하여 권한 부여
        authorities.add(()-> user.getRole().name());
        return authorities;
    }

    @Override
    public String getPassword(){
        return user.getPassword(); //비밀번호
    }

    @Override
    public String getUsername(){
        return user.getUsername(); //이메일을 username으로 사용
    }

    public String getUserEmail(){
        return user.getUsername();
    }

    public String getRole(){
        return user.getRole().name();
    }

    @Override
    public boolean isAccountNonExpired(){
        return true; //계정 만료되지 않음
    }

    @Override
    public boolean isAccountNonLocked(){
        return true; //계정 잠금되지 않음
    }

    @Override
    public boolean isCredentialsNonExpired(){
        return true; //자격증명 만료되지 않음
    }

    @Override
    public boolean isEnabled(){
        return true; //활성화된 계정
    }
}

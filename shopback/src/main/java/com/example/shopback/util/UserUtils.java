package com.example.shopback.util;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.shopback.componant.Role;
import com.example.shopback.entity.User;
import com.example.shopback.repository.UserRepository;

@Component
public class UserUtils {
    
    @Autowired
    private UserRepository userRepository;

    //현재 로그인한 사용자의 이메일
    public String getUsername(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return username;
    }

    //현재 사용자의 ROLE
    public String getUserRole(){
        //세션의 사용자 권한 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        //권한 가져오기
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        if(iter.hasNext()){
            GrantedAuthority authority = iter.next();
            
            //권한을 문자열로 반환
            return authority.getAuthority();
        }
        return null;
    }

    //사용자 이름과 역할을 담은 DTO 반환
    public User getUserNameAndRole(){
        //현재 로그인한 사용자 정보 가져오기
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //세션에서 권한 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
         // 첫 번째 권한을 가져옴
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        // 문자열을 Role Enum으로 변환  
        Role roleEnum = Role.valueOf(role); 
          

        //User 엔티티 객체를 생성하고 사용자 정보를 설정
        User user = new User();
        user.setUsername(username); //이메일을 이름으로 사용
        user.setRole(roleEnum); //권한 설정
        return user;
    }

    // 로그인한 사용자의 세부 데이터 (Role이 `ROLE_ANONYMOUS`인 경우 null 반환)
    public User getUserData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 세션에서 권한 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        // `ROLE_ANONYMOUS` 사용자일 경우 null 반환
        if ("ROLE_ANONYMOUS".equals(role)) {
            return null;
        }

        // Role enum으로 변환
        Role roleEnum = Role.valueOf(role); // 문자열을 Role Enum으로 변환

        // 실제 사용자 데이터를 DB에서 가져옴
        User user = userRepository.findByUsername(username);  // JPA를 사용하여 User 엔티티 반환
        user.setRole(roleEnum);  // Role 설정
        return user;
    }
}

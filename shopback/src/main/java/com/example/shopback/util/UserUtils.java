package com.example.shopback.util;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.shopback.component.Role;
import com.example.shopback.entity.User;
import com.example.shopback.repository.UserRepository;

@Component
public class UserUtils {
    
    @Autowired
    private UserRepository userRepository;

    //현재 로그인한 사용자의 이메일     現在ログインしているユーザーのメールアドレス
    public String getUsername(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return username;
    }

    //현재 사용자의 ROLE            現在ログインしているユーザー権限
    public String getUserRole(){
        //세션의 사용자 권한 가져오기       セッションのユーザー権限を取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        //권한 가져오기                 権限の取得
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        if(iter.hasNext()){
            GrantedAuthority authority = iter.next();
            
            //권한을 문자열로 반환      権限を文字列に返還
            return authority.getAuthority();
        }
        return null;
    }

    //사용자 이름과 역할을 담은 DTO 반환        ユーザーのメールアドレスと権限を持っているDTOを返還
    public User getUserNameAndRole(){
        //현재 로그인한 사용자 정보 가져오기        現在ログインしているユーザーの情報を取得
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //세션에서 권한 가져오기                    セッションから権限を取得
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
                          
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        // 문자열을 Role Enum으로 변환      文字列をRole　Enumに変換
        Role roleEnum = Role.valueOf(role); 
          

        //User 엔티티 객체를 생성하고 사용자 정보를 설정    UserのEntity客体を生成し、ユーザーの情報を設定
        User user = new User();
        user.setUsername(username); //이메일을 이름으로 사용        メールアドレスをUsernameに使用
        user.setRole(roleEnum); //권한 설정                     権限設定
        return user;
    }

    // 로그인한 사용자의 세부 데이터 (Role이 `ROLE_ANONYMOUS`인 경우 null 반환)
    // ログインしているユーザーの詳細データ（Roleが `ROLE_ANONYMOUS`の場合、Nullを返還）
    public User getUserData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 세션에서 권한 가져오기       セッションから権限を取得
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        // `ROLE_ANONYMOUS` 사용자일 경우 null 반환     `ROLE_ANONYMOUS`のユーザーの場合、Null返還
        if ("ROLE_ANONYMOUS".equals(role)) {
            return null;
        }

        // Role enum으로 변환   Role　Enumに変換
        Role roleEnum = Role.valueOf(role); // 문자열을 Role Enum으로 변환  文字列をRole　Enumに変換

        // 실제 사용자 데이터를 DB에서 가져옴   実際のユーザーのデータをデータベースから取得
        // Optional에서 User 객체를 안전하게 추출   OptionalからUser客体を抽出
        User user = userRepository.findByUsername(username).orElse(null); 

        if (user != null) {
            user.setRole(roleEnum);  // Role 設定
            return user;
        }

        // User가 없다면 null 반환  Userが存在しない場合、Null返還
        return null;
    }
}

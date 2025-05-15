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

    // 현재 로그인한 사용자의 이메일 주소を取得
    public String getUsername() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return username;
    }

    // 현재 로그인한 사용자의 ROLE（権限）を取得
    public String getUserRole() {
        // セッションからユーザーの認証情報を取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        // 権限があるか確認して、1つ目の権限を返す
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        if (iter.hasNext()) {
            GrantedAuthority authority = iter.next();
            return authority.getAuthority(); // 例: ROLE_USER
        }
        return null;
    }

    // 사용자 이메일과 역할 정보를 담은 User 엔티티를 반환（認証中のユーザーのメールとロール情報を含んだUserエンティティを返す）
    public User getUserNameAndRole() {
        // 現在のユーザー名（メール）を取得
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 権限取得
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        // 文字列からEnumへの変換
        Role roleEnum = Role.valueOf(role);

        // Userエンティティの構築
        User user = new User();
        user.setUsername(username);
        user.setRole(roleEnum);
        return user;
    }

    // 로그인한 사용자 상세 정보 반환（ROLE_ANONYMOUS인 경우 null） ログイン中のユーザー情報を返す（匿名ユーザーならnull）
    public User getUserData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 권한 확인（ROLEが匿名であればnullを返す）
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        String role = iter.hasNext() ? iter.next().getAuthority() : null;

        if ("ROLE_ANONYMOUS".equals(role)) {
            return null;
        }

        Role roleEnum = Role.valueOf(role);

        // データベースからユーザー情報を取得
        User user = userRepository.findByUsername(username).orElse(null);

        if (user != null) {
            user.setRole(roleEnum); // ROLE再設定
            return user;
        }

        return null;
    }
}

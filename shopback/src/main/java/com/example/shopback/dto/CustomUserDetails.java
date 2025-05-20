package com.example.shopback.dto;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.shopback.entity.User;

//  Spring Security認証用のユーザー詳細情報クラス
public class CustomUserDetails implements UserDetails {

    private User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    //  権限リストを返却（ROLE_付き）
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        // Role列挙型を "ROLE_〇〇" 形式に変換して追加
        authorities.add(() -> "ROLE_" + user.getRole().name());

        return authorities;
    }

    //  パスワードを返却（エンコード済）
    @Override
    public String getPassword() {
        return user.getPassword(); // パスワード
    }

    //  ログインIDとして使用するユーザー名（メールアドレス）
    @Override
    public String getUsername() {
        return user.getUsername(); // メールアドレスをユーザーIDとして使用
    }

    //  メールアドレスを返却（別名メソッド）
    public String getUserEmail() {
        return user.getUsername();
    }

    //  権限名を文字列で取得（例: ADMIN / USER）
    public String getRole() {
        return user.getRole().name();
    }

    //  アカウントの有効期限切れチェック（常に有効）
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //  アカウントロック状態チェック（常に非ロック）
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //  資格情報（パスワード）の有効期限切れチェック（常に有効）
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //  アカウント有効性チェック（常に有効）
    @Override
    public boolean isEnabled() {
        return true;
    }
}

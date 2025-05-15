package com.example.shopback.entity;

import java.util.List;

import com.example.shopback.component.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "UserTable")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id; // ユーザーID（主キー）

    @Column(name = "user_email", unique = true)
    private String username; // ユーザー名（メールアドレス）

    @Column(name = "password")
    private String password; // パスワード

    @Column(name = "usernic")
    private String usernic; // ニックネーム

    @Enumerated(EnumType.STRING)
    private Role role; // ユーザーの権限（USER / ADMIN）

    @Column(name = "user_address")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Address> address; // ユーザーに紐づく住所リスト（1対多）

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders; // ユーザーに紐づく注文リスト（1対多）
}

package com.example.shopback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shopback.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // メールアドレスでユーザーを検索（ログインに使用）
    Optional<User> findByUsername(String username);

    // ニックネームでユーザーを検索（ID探しなど）
    Optional<User> findByUsernic(String usernic);

    // メールアドレスの重複確認（会員登録時のバリデーション）
    boolean existsByUsername(String username);

    // ニックネームの重複確認（会員登録時のバリデーション）
    boolean existsByUsernic(String usernic);

    // ユーザーの住所情報を一緒に取得（fetch join）
    @EntityGraph(attributePaths = "address")
    Optional<User> findWithAddressByUsername(String username);

    // 注文および配送先住所まで含めてユーザー情報を取得
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders o LEFT JOIN FETCH o.orderAddress WHERE u.username = :username")
    Optional<User> findWithOrdersByUsername(@Param("username") String username);
}

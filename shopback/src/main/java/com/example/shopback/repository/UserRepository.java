package com.example.shopback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shopback.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 찾기（로그인용）
    // メールアドレスでユーザーを検索（ログインに使用）
    Optional<User> findByUsername(String username);

    // 닉네임으로 사용자 찾기（아이디 찾기 등）
    // ニックネームでユーザーを検索（ID探しなど）
    Optional<User> findByUsernic(String usernic);

    // 이메일 중복 확인（회원가입 시 유효성 검사）
    // メールアドレスの重複確認（会員登録時のバリデーション）
    boolean existsByUsername(String username);

    // 닉네임 중복 확인（회원가입 시 유효성 검사）
    // ニックネームの重複確認（会員登録時のバリデーション）
    boolean existsByUsernic(String usernic);

    // 주소 정보까지 함께 불러오기 (fetch join)
    // ユーザーの住所情報を一緒に取得（fetch join）
    @EntityGraph(attributePaths = "address")
    Optional<User> findWithAddressByUsername(String username);

    // 주문 및 배송주소까지 포함하여 사용자 정보 조회
    // 注文および配送先住所まで含めてユーザー情報を取得
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders o LEFT JOIN FETCH o.orderAddress WHERE u.username = :username")
    Optional<User> findWithOrdersByUsername(@Param("username") String username);
}

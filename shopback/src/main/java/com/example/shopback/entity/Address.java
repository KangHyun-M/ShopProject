package com.example.shopback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//  ユーザーの住所情報を表すエンティティ
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Address")
public class Address {

    //  住所ID（主キー、オートインクリメント）
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    //  郵便番号
    @Column(name = "zip_code")
    private String zipcode;

    //  住所詳細
    @Column(name = "address")
    private String address;

    //  ユーザーとの多対一関係（外部キー：user_id）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //  代表住所かどうか（true: 代表住所）
    @Column(name = "is_main", nullable = false)
    @Builder.Default
    private Boolean isMain = false;
}

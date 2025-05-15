package com.example.shopback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "order_address")
public class OrderAddress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderAddr_id")
    private Long id; // 配送先ID（主キー）

    @Column(name = "orderAddr_zip")
    private String zipcode; // 郵便番号

    @Column(name = "orderAddr_addr")
    private String address; // 住所（都道府県、市区町村、番地など）

    @OneToOne(mappedBy = "orderAddress")
    private Order order; // 対応する注文（注文エンティティと1対1）
}

package com.example.shopback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
    private Long id;

    @Column(name = "orderAddr_zip")
    private String zipcode;

    @Column(name = "orderAddr_addr")
    private String address;

    @OneToOne(mappedBy = "orderAddress")
    @JoinColumn(name = "orderAddr_orderId")
    private Order order;
}

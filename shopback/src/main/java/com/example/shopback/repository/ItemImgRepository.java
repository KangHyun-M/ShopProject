package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopback.entity.ItemImg;

public interface ItemImgRepository extends JpaRepository<ItemImg, Long> {
    
}

package com.example.shopback.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopback.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}

package com.example.shopback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long id;
    private String zipcode;
    private String address;
    private boolean isMain;
}

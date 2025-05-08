package com.example.shopback.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemUpdateDTO {
    
    private String itemname;
    private String description;
    private int price;
    private String category;
    private List<String> remainImg;
    private String mainImgPath; 
}

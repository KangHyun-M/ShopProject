package com.example.shopback.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {
    
    private Long id;
    private String itemname;
    private String description;
    private int price;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private List<String> imagePaths;

}

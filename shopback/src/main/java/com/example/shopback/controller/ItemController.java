package com.example.shopback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.service.ItemService;

@RestController
@RequestMapping("/api")
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    //상품 등록
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/admin/registration",consumes = "multipart/form-data")
    public ResponseEntity<Void> createItem(
        @RequestPart("item")ItemDTO itemDTO,
        @RequestPart("images")List<MultipartFile> images){
        
        itemService.createItem(itemDTO,images);
        return ResponseEntity.ok().build();
    }

    

    //모두조회
    @GetMapping("/items")
    public ResponseEntity<List<ItemDTO>> getItems(@RequestParam(required = false)String category){
        List<ItemDTO> items;

        if(category != null && !category.equals("전체보기")){
            items = itemService.getItemsByCategory(category);
        } else {
            items = itemService.getAllItems();
        }

        return ResponseEntity.ok(items);
    }
    

    //상세조회
    @GetMapping("/items/{id}")
    public ResponseEntity<ItemDTO> getItemByID(@PathVariable Long id){
        return itemService.getItemById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
}

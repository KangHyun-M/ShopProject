package com.example.shopback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.service.ItemService;

@RestController
@RequestMapping("/api")
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    //상품 등록
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/post-item")
    public void createItem(@RequestBody ItemDTO itemDTO){
        itemService.createItem(itemDTO);
    }

    //상품 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/post-item/{id}")
    public void updateItem(@PathVariable Long id, @RequestBody ItemDTO itemDTO){
        itemService.updateItem(id,itemDTO);
    }

    //상품 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/post-item/{id}")
    public void deleteItem(@PathVariable Long id){
        itemService.deleteItem(id);
    }

    //모두조회
    @GetMapping("/list/items")
    public List<ItemDTO> getAllItem(){
        return itemService.getAllItem();
    }

    //상세조회
    @GetMapping("/list/items/{id}")
    public ItemDTO getItemById(@PathVariable Long id){
        return itemService.getItemById(id);
    }
}

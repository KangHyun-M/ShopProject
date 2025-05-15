package com.example.shopback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.dto.ItemUpdateDTO;
import com.example.shopback.service.ItemService;

@RestController
@RequestMapping("/api")
public class ItemController {
    
    @Autowired
    private ItemService itemService;

    // 📦 商品登録（画像を含む multipart/form-data）
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/admin/registration", consumes = "multipart/form-data")
    public ResponseEntity<Void> createItem(
        @RequestPart("item") ItemDTO itemDTO,
        @RequestPart("images") List<MultipartFile> images
    ) {
        itemService.createItem(itemDTO, images);
        return ResponseEntity.ok().build();
    }

    // 📃 商品一覧取得（カテゴリー指定があれば絞り込み）
    @GetMapping("/items")
    public ResponseEntity<List<ItemDTO>> getItems(@RequestParam(required = false) String category) {
        List<ItemDTO> items;

        if (category != null && !category.equals("Total")) {
            items = itemService.getItemsByCategory(category); // カテゴリー別
        } else {
            items = itemService.getAllItems(); // 全商品
        }

        return ResponseEntity.ok(items);
    }

    // 🔍 商品詳細取得（ID指定）
    @GetMapping("/items/{id}")
    public ResponseEntity<ItemDTO> getItemByID(@PathVariable Long id) {
        return itemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🛠 商品修正（multipart/form-data で画像も受け付け）
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/admin/items/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateItem(
        @PathVariable Long id,
        @RequestPart("item") ItemUpdateDTO updateDTO,
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        itemService.updateItem(id, updateDTO, images);
        return ResponseEntity.ok().build();
    }

    // 🗑 商品削除（論理削除：deleted = true）
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/items/{id}/delete")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    // ♻️ 削除された商品を復旧
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/items/{id}/restore")
    public ResponseEntity<Void> restoreItem(@PathVariable Long id) {
        itemService.restoreItem(id);
        return ResponseEntity.ok().build();
    }

    // 🗃️ 削除された商品一覧取得（管理者専用）
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/items/deleted")
    public ResponseEntity<List<ItemDTO>> getDeletedItems() {
        return ResponseEntity.ok(itemService.getDeletedItems());
    }
}

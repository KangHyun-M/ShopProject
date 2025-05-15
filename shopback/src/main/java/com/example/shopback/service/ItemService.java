package com.example.shopback.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.dto.ItemUpdateDTO;
import com.example.shopback.entity.Item;
import com.example.shopback.entity.ItemImg;
import com.example.shopback.repository.ItemImgRepository;
import com.example.shopback.repository.ItemRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ItemService {

    private ItemImgRepository itemImgRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemImgService itemImgService;

    ItemService(ItemImgRepository itemImgRepository) {
        this.itemImgRepository = itemImgRepository;
    }

    // DTO → Entity 変換
    private Item toEntity(ItemDTO itemDTO) {
        return Item.builder()
                .itemname(itemDTO.getItemname())
                .description(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .category(itemDTO.getCategory())
                .build();
    }

    // Entity → DTO 変換
    private ItemDTO toDTO(Item item) {
        List<ItemImg> imgs = item.getItemImgs();
        imgs.sort((a, b) -> Boolean.compare(b.getMainImg(), a.getMainImg())); // サムネイルを先頭に

        List<String> imgPaths = imgs.stream()
                .map(ItemImg::getImgPath)
                .toList();

        return ItemDTO.builder()
                .id(item.getId())
                .itemname(item.getItemname())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .createdAt(item.getCreatedAt())
                .modifiedAt(item.getModifiedAt())
                .imagePaths(imgPaths)
                .build();
    }

    // 商品登録
    public void createItem(ItemDTO itemDTO, List<MultipartFile> images) {
        Item item = toEntity(itemDTO);
        itemRepository.save(item);

        if (images != null && !images.isEmpty()) {
            int mainIndex = itemDTO.getMainImg() != null ? itemDTO.getMainImg() : 0;
            itemImgService.uploadImg(item, images, mainIndex); // 画像登録
        }
    }

    // 全商品照会
    public List<ItemDTO> getAllItems() {
        return itemRepository.findByDeletedFalse()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // カテゴリー別商品照会
    public List<ItemDTO> getItemsByCategory(String category) {
        return itemRepository.findByCategoryAndDeletedFalse(category)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // 商品詳細照会
    public Optional<ItemDTO> getItemById(Long id) {
        return itemRepository.findById(id)
                .filter(item -> !item.isDeleted()) // 削除された商品を除外
                .map(this::toDTO);
    }

    // 商品修正
    public void updateItem(Long id, ItemUpdateDTO updateDTO, List<MultipartFile> images) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("該当する商品は存在しません"));

        List<ItemImg> existingImgs = item.getItemImgs();

        // 維持される画像パス
        List<String> remainingPaths = Optional.ofNullable(updateDTO.getRemainImg())
                .orElse(existingImgs.stream().map(ItemImg::getImgPath).toList());

        // 削除対象画像
        List<ItemImg> imgsToDelete = existingImgs.stream()
                .filter(img -> !remainingPaths.contains(img.getImgPath()))
                .toList();

        // 削除処理
        for (ItemImg img : imgsToDelete) {
            itemImgService.deleteImage(img);
        }

        // サムネイル設定（既存画像の中で）
        for (ItemImg img : existingImgs) {
            if (remainingPaths.contains(img.getImgPath())) {
                img.setMainImg(img.getImgPath().equals(updateDTO.getMainImgPath()));
            }
        }

        // 変更をDBに反映
        itemImgRepository.saveAll(existingImgs);

        // 新しい画像をアップロード（サムネイル対象ではない）
        if (images != null && !images.isEmpty()) {
            itemImgService.uploadImg(item, images, -1);
        }

        // 商品情報更新
        item.setItemname(updateDTO.getItemname());
        item.setDescription(updateDTO.getDescription());
        item.setPrice(updateDTO.getPrice());
        item.setCategory(updateDTO.getCategory());
        item.setModifiedAt(LocalDateTime.now());

        itemRepository.save(item);
    }

    // 商品削除（論理削除）
    @Transactional
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("該当する商品は存在しません"));

        item.setDeleted(true);
        item.setModifiedAt(LocalDateTime.now());

        itemRepository.save(item);
    }

    // 商品復旧
    @Transactional
    public void restoreItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("該当する商品は存在しません"));

        item.setDeleted(false);
        item.setModifiedAt(LocalDateTime.now());

        itemRepository.save(item);
    }

    // 削除済み商品のみ照会
    public List<ItemDTO> getDeletedItems() {
        return itemRepository.findByDeletedTrue()
                .stream()
                .map(this::toDTO)
                .toList();
    }
}

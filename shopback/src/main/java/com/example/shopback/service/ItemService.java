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

    private Item toEntity(ItemDTO itemDTO){
        return Item.builder()
                .itemname(itemDTO.getItemname())
                .description(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .category(itemDTO.getCategory())
                .build();
    }

    private ItemDTO toDTO(Item item) {
        List<ItemImg> imgs = item.getItemImgs();
        imgs.sort((a, b) -> Boolean.compare(b.getMainImg(), a.getMainImg())); //대표이미지가 앞에 오도록
    
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


    //싱품등록
    public void createItem(ItemDTO itemDTO, List<MultipartFile> images) {
        Item item = toEntity(itemDTO);
        itemRepository.save(item);
    
        if (images != null && !images.isEmpty()) {
            int mainIndex = itemDTO.getMainImg() != null ? itemDTO.getMainImg() : 0;
            itemImgService.uploadImg(item, images, mainIndex);
        }
    }


    //전체 조회
    public List<ItemDTO> getAllItems(){
        return itemRepository.findByDeletedFalse()
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    //카테고리별 조회
    public List<ItemDTO> getItemsByCategory(String category){
        return itemRepository.findByCategoryAndDeletedFalse(category)
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    //상세조회
    public Optional<ItemDTO> getItemById(Long id){
        return itemRepository.findById(id)
            .filter(item -> !item.isDeleted())  //삭제된 상품 제외하고 검색
            .map(this::toDTO);
    }

    //상품수정
    public void updateItem(Long id, ItemUpdateDTO updateDTO, List<MultipartFile> images) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Item not found"));
    
        List<ItemImg> existingImgs = item.getItemImgs();
    
        // 유지할 이미지 경로
        List<String> remainingPaths = Optional.ofNullable(updateDTO.getRemainImg())
            .orElse(existingImgs.stream().map(ItemImg::getImgPath).toList());
    
        // 삭제 대상 이미지
        List<ItemImg> imgsToDelete = existingImgs.stream()
            .filter(img -> !remainingPaths.contains(img.getImgPath()))
            .toList();
    
        // 삭제 수행
        for (ItemImg img : imgsToDelete) {
            itemImgService.deleteImage(img);
        }
    
        // 대표 이미지 설정 (기존 이미지 중에서)
        for (ItemImg img : existingImgs) {
            if (remainingPaths.contains(img.getImgPath())) {
                img.setMainImg(img.getImgPath().equals(updateDTO.getMainImgPath()));
            }
        }
    
        // 변경사항 DB 반영
        itemImgRepository.saveAll(existingImgs);
    
        // 새 이미지 업로드 (대표 이미지 아님)
        if (images != null && !images.isEmpty()) {
            itemImgService.uploadImg(item, images, -1);
        }
    
        item.setItemname(updateDTO.getItemname());
        item.setDescription(updateDTO.getDescription());
        item.setPrice(updateDTO.getPrice());
        item.setCategory(updateDTO.getCategory());
        item.setModifiedAt(LocalDateTime.now());
    
        itemRepository.save(item);
    }
    
    
    //상품 삭제
    @Transactional
    public void deleteItem(Long id){
        Item item = itemRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Item not found"));

        item.setDeleted(true);
        item.setModifiedAt(LocalDateTime.now());

        itemRepository.save(item);
    }


    //상품 복구
    @Transactional
    public void restoreItem(Long id){
        Item item = itemRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Item not found"));

        item.setDeleted(false);
        item.setModifiedAt(LocalDateTime.now());

        itemRepository.save(item);
    }

    //삭제된 상품만 검색
    public List<ItemDTO> getDeletedItems(){
        return itemRepository.findByDeletedTrue()
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }
}

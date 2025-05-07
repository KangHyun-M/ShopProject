package com.example.shopback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.entity.Item;
import com.example.shopback.repository.ItemRepository;
import com.example.shopback.entity.ItemImg;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemImgService itemImgService;

    private Item toEntity(ItemDTO itemDTO){
        return Item.builder()
                .itemname(itemDTO.getItemname())
                .description(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .category(itemDTO.getCategory())
                .build();
    }

    private ItemDTO toDTO(Item item){
        List<String> imgPaths = item.getItemImgs().stream()
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
    public void createItem(ItemDTO dto, List<MultipartFile> images){
        Item item = toEntity(dto);
        itemRepository.save(item);

        if(images != null && !images.isEmpty()){
            itemImgService.uploadImg(item, images);
        }
    }


    //전체 조회
    public List<ItemDTO> getAllItems(){
        return itemRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    //카테고리별 조회
    public List<ItemDTO> getItemsByCategory(String category){
        return itemRepository.findByCategory(category)
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    //상세조회
    public Optional<ItemDTO> getItemById(Long id){
        return itemRepository.findById(id).map(this::toDTO);
    }


}

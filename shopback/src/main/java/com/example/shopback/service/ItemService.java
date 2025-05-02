package com.example.shopback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shopback.dto.ItemDTO;
import com.example.shopback.entity.Item;
import com.example.shopback.repository.ItemRepository;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;

    private Item toEntity(ItemDTO itemDTO){
        return Item.builder()
                .itemname(itemDTO.getItemname())
                .desccription(itemDTO.getDescription())
                .price(itemDTO.getPrice())
                .category(itemDTO.getCategory())
                .build();
    }

    private ItemDTO toDTO(Item entity){
        return ItemDTO.builder()
                .itemname(entity.getItemname())
                .description(entity.getDesccription())
                .price(entity.getPrice())
                .category(entity.getCategory())
                .build();
    }

    //엔티티 리스트를 DTO 리스트로
    private List<ItemDTO> toDTOList(List<Item> items){
        return items.stream()
                .map(this::toDTO)
                .toList();
    }

    //전체조회
    public List<ItemDTO> getAllItem(){
        return itemRepository.findAll().stream()
        .map(this::toDTO)
        .toList();
    }

    //상세조회
    public ItemDTO getItemById(Long id){
        Optional<Item> itemOptional = itemRepository.findById(id);
        if(itemOptional.isPresent()){
            return toDTO(itemOptional.get());
        } else {
            throw new RuntimeException("상품을 찾을 수 없습니다");
        }
    }
    
    //등록
    public void createItem(ItemDTO itemDTO){
        Item item = toEntity(itemDTO);
        itemRepository.save(item);
    }

    //수정
    public void updateItem(Long id, ItemDTO itemDTO){
        Optional<Item> itemOptional = itemRepository.findById(id);

        if(itemOptional.isPresent()){
            Item item = itemOptional.get();
            item.setItemname(itemDTO.getItemname());
            item.setPrice(itemDTO.getPrice());
            item.setCategory(itemDTO.getCategory());
            item.setDesccription(itemDTO.getDescription());

            itemRepository.save(item); //수정된 상품 저장
        } else{
            throw new RuntimeException("상품을 찾을수 없습니다");
        }
    }

    //삭제
    public void deleteItem(Long id){
        itemRepository.deleteById(id);
    }
}

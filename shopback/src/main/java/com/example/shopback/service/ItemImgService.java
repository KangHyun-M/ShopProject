package com.example.shopback.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.shopback.entity.Item;
import com.example.shopback.entity.ItemImg;
import com.example.shopback.repository.ItemImgRepository;

import lombok.RequiredArgsConstructor;

@Service
@org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ItemImgService {

    
    private final ItemImgRepository itemImgRepository;

    public void uploadImg(Item item, List<MultipartFile> images, Integer mainImg) {
        String uploadDir = "C:/workspace_rct/ShopProject/shopfront/public/images";
    
        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);
            try {
                String original = image.getOriginalFilename();
                if (original == null || original.isBlank()) {
                    original = "default.png";
                }
    
                String safeFileName = UUID.randomUUID().toString() + "_" +
                        original.replaceAll("[^a-zA-Z0-9._-]", "_");
    
                String filePath = uploadDir + "/" + safeFileName;
                String imgPath = "/images/" + safeFileName;
    
                Path path = Paths.get(filePath);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
    
                ItemImg itemImg = ItemImg.builder()
                        .item(item)
                        .imgPath(imgPath)
                        .mainImg(i == mainImg) // サムネイル
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build();
    
                itemImgRepository.save(itemImg);
            } catch (IOException e) {
                throw new RuntimeException("画像の保存に失敗しました", e);
            }
        }
    }
    
    
    //이미지 삭제　イメージを削除
    public void deleteImage(ItemImg img){
        try{
            Path path = Paths.get("C:/workspace_rct/ShopProject/shopfront/public" + img.getImgPath());
            Files.deleteIfExists(path);
        } catch(IOException e){
            e.printStackTrace();
        }
        Item item = img.getItem();
        item.getItemImgs().remove(img); //JPA リレーションシップから削除
        itemImgRepository.delete(img);  //DB에서 제거   データベースから削除
    }
}

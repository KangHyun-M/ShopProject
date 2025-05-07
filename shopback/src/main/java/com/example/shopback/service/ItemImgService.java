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

    public void uploadImg(Item item, List<MultipartFile> images){
        String uploadDir = "C:/workspace_rct/ShopProject/shopfront/public/images";

        for(MultipartFile image : images){
            try{
                String original = image.getOriginalFilename();
                if (original == null || original.isBlank()) {
                    original = "default.png";
                }
                String safeFileName = UUID.randomUUID().toString() + "_" +
                original.replaceAll("[^a-zA-Z0-9._-]", "_"); // 특수 문자 제거

                String filePath = uploadDir + "/" + safeFileName;
                String imgPath = "/images/" + safeFileName;

                Path path = Paths.get(filePath);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());

                ItemImg itemImg = ItemImg.builder()
                            .item(item)
                            .imgPath(imgPath)
                            .createdAt(LocalDateTime.now())
                            .modifiedAt(LocalDateTime.now())
                            .build();


                        itemImgRepository.save(itemImg);
            } catch (IOException e){
                throw new RuntimeException("failed to save images", e);
            }
        }
    }
    
}

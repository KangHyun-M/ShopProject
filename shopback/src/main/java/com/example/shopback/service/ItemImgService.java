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

    /**
     * 商品画像をアップロードしてDBに保存
     * @param item 対象商品
     * @param images 画像ファイル一覧
     * @param mainImg サムネイル画像のインデックス
     */
    public void uploadImg(Item item, List<MultipartFile> images, Integer mainImg) {
        String uploadDir = "C:/workspace_rct/ShopProject/shopfront/public/images"; // 保存先ディレクトリ

        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);
            try {
                String original = image.getOriginalFilename();
                if (original == null || original.isBlank()) {
                    original = "default.png";
                }

                // ファイル名を安全な形式に変換
                String safeFileName = UUID.randomUUID().toString() + "_" +
                        original.replaceAll("[^a-zA-Z0-9._-]", "_");

                String filePath = uploadDir + "/" + safeFileName;
                String imgPath = "/images/" + safeFileName;

                Path path = Paths.get(filePath);
                Files.createDirectories(path.getParent()); // ディレクトリ作成（なければ）
                Files.write(path, image.getBytes());       // 画像ファイル保存

                // データベースに画像情報保存
                ItemImg itemImg = ItemImg.builder()
                        .item(item)
                        .imgPath(imgPath)
                        .mainImg(i == mainImg) // サムネイルかどうか判定
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build();

                itemImgRepository.save(itemImg);
            } catch (IOException e) {
                throw new RuntimeException("画像の保存に失敗しました", e);
            }
        }
    }

    /**
     * 画像ファイルおよびDBのレコードを削除
     * @param img 対象画像エンティティ
     */
    public void deleteImage(ItemImg img) {
        try {
            // ファイルシステム上の画像ファイルを削除
            Path path = Paths.get("C:/workspace_rct/ShopProject/shopfront/public" + img.getImgPath());
            Files.deleteIfExists(path);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // JPAのリレーションから削除（親エンティティのListから削除）
        Item item = img.getItem();
        item.getItemImgs().remove(img);

        // データベースから削除
        itemImgRepository.delete(img);
    }
}

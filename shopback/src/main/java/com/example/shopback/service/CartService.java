package com.example.shopback.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.shopback.dto.CartItemDTO;
import com.example.shopback.entity.CartItem;
import com.example.shopback.entity.Item;
import com.example.shopback.entity.ItemImg;
import com.example.shopback.entity.User;
import com.example.shopback.repository.CartRepository;
import com.example.shopback.repository.ItemRepository;
import com.example.shopback.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CartService {
    
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    // カート内の商品リストを取得する
    public List<CartItemDTO> getCartItems(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        // 有効な商品と削除されていないカートアイテムを取得
        List<CartItem> cartItems = cartRepository.fetchActiveCartItemsWithValidItem(user.getId());

        List<CartItemDTO> dtoList = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Item item = cartItem.getItem();

            // メイン画像のパスを取得
            Optional<ItemImg> mainImg = item.getItemImgs().stream()
                .filter(ItemImg::getMainImg)
                .findFirst();

            String mainImagePath = mainImg.map(ItemImg::getImgPath).orElse(null);

            CartItemDTO dto = CartItemDTO.builder()
                .cartItemId(cartItem.getId())
                .itemId(item.getId())
                .itemName(item.getItemname())
                .description(item.getDescription())
                .price(item.getPrice())
                .quantity(cartItem.getQuantity())
                .imgUrl(mainImagePath)
                .build();

            dtoList.add(dto);
        }

        return dtoList;
    }

    // 商品をカートに追加
    public void addCart(String username, Long itemId, int quantity) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("該当する商品は存在しません"));

        CartItem cartItem = CartItem.builder()
            .user(user)
            .item(item)
            .quantity(quantity)
            .createdAt(LocalDateTime.now())
            .modifiedAt(LocalDateTime.now())
            .build();

        cartRepository.save(cartItem);
    }

    // カート内商品の数量を更新
    public void updateQuantity(String username, Long cartItemId, int quantity) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        CartItem cartItem = cartRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("該当する商品は存在しません"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("アクセス権限がありません");
        }

        cartItem.setQuantity(quantity);
        cartItem.setModifiedAt(LocalDateTime.now());

        cartRepository.save(cartItem);
    }

    // カート商品を削除（論理削除）
    public void deleteCartItem(String username, Long cartItemId) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        CartItem cartItem = cartRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("該当する商品は存在しません"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("アクセス権限がありません");
        }

        cartItem.setDeleted(true);
        cartItem.setModifiedAt(LocalDateTime.now());

        cartRepository.save(cartItem);
    }

    // 選択されたカート商品のリストを取得
    public List<CartItemDTO> getSelectedCartItems(String username, List<Long> ids) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

        return cartRepository.findByIdInAndUserId(ids, user.getId()).stream()
            .filter(cartItem -> !cartItem.isDeleted()) // 削除されていないアイテムのみ
            .map(cartItem -> {
                Item item = cartItem.getItem();
                Optional<ItemImg> mainImg = item.getItemImgs().stream()
                    .filter(ItemImg::getMainImg)
                    .findFirst();

                return CartItemDTO.builder()
                    .cartItemId(cartItem.getId())
                    .itemId(item.getId())
                    .itemName(item.getItemname())
                    .description(item.getDescription())
                    .price(item.getPrice())
                    .quantity(cartItem.getQuantity())
                    .imgUrl(mainImg.map(ItemImg::getImgPath).orElse(null))
                    .build();
            })
            .collect(Collectors.toList());
    }
}

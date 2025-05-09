package com.example.shopback.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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



    //カートの商品リスト取得
    public List<CartItemDTO> getCartItems(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

    List<CartItem> cartItems = cartRepository.findByUser_Id(user.getId()).stream()
                        .filter(item -> !item.isDeleted())
                        .toList();

    List<CartItemDTO> dtoList = new ArrayList<>();

    for (CartItem cartItem : cartItems) {
        Item item = cartItem.getItem();

        // mainImg 필터링 후 경로 가져오기　mainImgをフィルタリング後、パスを取得
        Optional<ItemImg> mainImg = item.getItemImgs().stream()
            .filter(ItemImg::getMainImg) // Boolean 타입 그대로 사용　Booleanタイプを使用
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

    //Add item to cart　カートに商品を追加
    public void addCart(String username, Long itemId, int quantity){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("該当するユーザーは存在しません"));
        
        Item item = itemRepository.findById(itemId)
                        .orElseThrow(()-> new RuntimeException("該当する商品は存在しません"));

        
        CartItem cartItem = CartItem.builder()
                    .user(user)
                    .item(item)
                    .quantity(quantity)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();


        cartRepository.save(cartItem);
    }

    //Cart Item Amount Change   カート内の商品の数量変更
    public void updateQuantity(String username, Long cartItemId, int quantity){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("該当するユーザーは存在しません"));
        
        CartItem cartItem = cartRepository.findById(cartItemId)
                    .orElseThrow(()-> new RuntimeException("該当する商品は存在しません"));
            
        if(!cartItem.getUser().getId().equals(user.getId())){
            throw new AccessDeniedException("アクセス権限がありません");
        }

        cartItem.setQuantity(quantity);
        cartItem.setModifiedAt(LocalDateTime.now());
        
        cartRepository.save(cartItem);
    }


    //商品をカートから削除、物理的な削除ではない
    public void deleteCartItem(String username, Long cartItemId){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("該当するユーザーは存在しません"));

        CartItem cartItem = cartRepository.findById(cartItemId)
                    .orElseThrow(()-> new RuntimeException("該当する商品は存在しませんt"));

        if(!cartItem.getUser().getId().equals(user.getId())){
            throw new AccessDeniedException("アクセス権限がありません");
        }

        cartItem.setDeleted(true);
        cartItem.setModifiedAt(LocalDateTime.now());

        cartRepository.save(cartItem);
    }
}  

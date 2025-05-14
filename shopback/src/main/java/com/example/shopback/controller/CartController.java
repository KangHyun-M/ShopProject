package com.example.shopback.controller;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.CartItemDTO;
import com.example.shopback.dto.CartRequestDTO;
import com.example.shopback.service.CartService;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;
    
    @GetMapping("/user/cart")
    public ResponseEntity<List<CartItemDTO>> getUserCart(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        List<CartItemDTO> cartItems = cartService.getCartItems(username);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/user/cart")
    public ResponseEntity<?> addCart(@RequestBody CartRequestDTO cartRequestDTO, Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ログインしてください");
        }

        String username = authentication.getName();

        cartService.addCart(username, cartRequestDTO.getItemId(), cartRequestDTO.getQuantity());
        return ResponseEntity.ok("カートに追加完了");
    }

    @DeleteMapping("/user/cart/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartItemId, Authentication auth){
        String username = auth.getName();
        cartService.deleteCartItem(username, cartItemId);
        return ResponseEntity.ok("削除完了");
    }

    @PatchMapping("/user/cart/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
        @PathVariable Long cartItemId,
        @RequestParam int quantity,
        Authentication auth){
            cartService.updateQuantity(auth.getName(), cartItemId, quantity);
            return ResponseEntity.ok("数量変更完了");

    }

    @GetMapping("/user/cart/sum")
    public ResponseEntity<List<CartItemDTO>> getCartSum(@RequestParam String ids, Principal principal){
        String username = principal.getName();
        List<Long> idList = Arrays.stream(ids.split(","))
                              .map(Long::parseLong)
                              .toList();
        List<CartItemDTO> result = cartService.getSelectedCartItems(username, idList);
        
        return ResponseEntity.ok(result);
    }

    
}

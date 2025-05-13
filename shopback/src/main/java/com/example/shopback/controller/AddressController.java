package com.example.shopback.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.AddressDTO;
import com.example.shopback.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AddressController {
    
    private final AddressService addressService;

    @PostMapping("/user/address")
    public ResponseEntity<?> saveAddress(@RequestBody AddressDTO addressDTO, @AuthenticationPrincipal UserDetails userDetails){
        try{
            addressService.saveAddress(userDetails.getUsername(), addressDTO);
            return ResponseEntity.ok("住所が保存されました");
        } catch (Exception e){
            return ResponseEntity.status(500).body("住所の保存に失敗しました");
        }        
    }

    @GetMapping("/user/address")
    public ResponseEntity<List<AddressDTO>> getAddress(@AuthenticationPrincipal UserDetails userDetails){
        List<AddressDTO> list = addressService.getAddressList(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/address/{id}")
    public ResponseEntity<AddressDTO> getAddrById(@PathVariable Long id){
        return ResponseEntity.ok(addressService.getAddrById(id));
    }

    @PatchMapping("/user/address/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody AddressDTO addressDTO, @AuthenticationPrincipal UserDetails userDetails){
        addressService.updateAddress(id, userDetails.getUsername(), addressDTO);
        return ResponseEntity.ok("주소가 수정되었습니다");
    
    }

    @DeleteMapping("/user/address/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails){
        addressService.deleteAddress(id,userDetails.getUsername());
        return ResponseEntity.ok("주소가 삭제되었습니다");
    }

    @PatchMapping("/user/address/{id}/main")
    public ResponseEntity<?> setMainAddr(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails){

        addressService.setMainAddr(id, userDetails.getUsername());
        return ResponseEntity.ok("대표 주소가 설정되었습니다");
    }
}

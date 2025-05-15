package com.example.shopback.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.shopback.dto.AddressDTO;
import com.example.shopback.entity.Address;
import com.example.shopback.entity.User;
import com.example.shopback.repository.AddressRepository;
import com.example.shopback.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // 住所を新規保存
    @Transactional
    public void saveAddress(String username, AddressDTO addressDTO){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        Address address = Address.builder()
                    .zipcode(addressDTO.getZipcode())
                    .address(addressDTO.getAddress())
                    .user(user)
                    .isMain(false) // 初期は代表住所ではない
                    .build();
        
        addressRepository.save(address);
    }

    // ログインユーザーの住所リスト取得
    public List<AddressDTO> getAddressList(String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(() -> new RuntimeException("該当するユーザーは存在しません"));

        return user.getAddress().stream()
                .map(addr -> new AddressDTO(
                        addr.getId(),
                        addr.getZipcode(),
                        addr.getAddress(),
                        addr.getIsMain()
                ))
                .collect(Collectors.toList());
    }

    // 住所情報を修正
    @Transactional
    public void updateAddress(Long id, String username, AddressDTO addressDTO){
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("住所を見つけられません"));
        
        if(!address.getUser().getUsername().equals(username)){
            throw new RuntimeException("修正権限がありません");
        }

        address.setZipcode(addressDTO.getZipcode());
        address.setAddress(addressDTO.getAddress());

        addressRepository.save(address);
    }

    // IDで住所情報を取得
    public AddressDTO getAddrById(Long id){
        Address addr = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("住所が存在しません"));
        return new AddressDTO(addr.getId(), addr.getZipcode(), addr.getAddress(), addr.getIsMain());
    }

    // 住所を削除
    public void deleteAddress(Long id, String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(() -> new RuntimeException("該当するユーザーが存在しません"));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("該当する住所が存在しません"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("削除権限がありません");
        }

        addressRepository.delete(address);
    }

    // 代表住所を設定
    @Transactional
    public void setMainAddr(Long id, String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーを見つけられません"));

        // 全ての住所の代表フラグを false に設定
        user.getAddress().forEach(addr -> addr.setIsMain(false));

        // 指定した住所を代表住所に設定
        Address target = user.getAddress().stream()
            .filter(addr -> addr.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("該当する住所が存在しません"));

        target.setIsMain(true);
    }
}

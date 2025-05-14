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

    @Transactional
    public void saveAddress(String username, AddressDTO addressDTO){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("該当するユーザーは存在しません"));

        Address address = Address.builder()
                    .zipcode(addressDTO.getZipcode())
                    .address(addressDTO.getAddress())
                    .user(user)
                    .isMain(false)
                    .build();
        
        addressRepository.save(address);
    }

    public List<AddressDTO> getAddressList(String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(()-> new RuntimeException("該当するユーザーは存在しません"));

        return user.getAddress().stream()
                .map(addr -> new AddressDTO(
                        addr.getId(),
                        addr.getZipcode(),
                        addr.getAddress(),
                        addr.getIsMain()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateAddress(Long id, String username, AddressDTO addressDTO){
        Address address = addressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("주소를 찾을 수 없습니다."));
        
        if(!address.getUser().getUsername().equals(username)){
            throw new RuntimeException("수정 권한이 없습니다");
        }

        address.setZipcode(addressDTO.getZipcode());
        address.setAddress(addressDTO.getAddress());

        addressRepository.save(address);
    }

    public AddressDTO getAddrById(Long id){
        Address addr = addressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("주소가 존재하지 않습니다"));
        return new AddressDTO(addr.getId(),addr.getZipcode(), addr.getAddress(), addr.getIsMain());
    }

    public void deleteAddress(Long id, String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(()-> new RuntimeException("해당 유저가 존재하지 않습니다"));

        Address address = addressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("해당 주소가 존재하지 않습니다"));

        if(!address.getUser().getId().equals(user.getId())){
            throw new RuntimeException("삭제 권한이 없습니다");
        }

        addressRepository.delete(address);
    }

    @Transactional
    public void setMainAddr(Long id, String username){
        User user = userRepository.findWithAddressByUsername(username)
                .orElseThrow(()-> new RuntimeException("유저를 찾을 수 없습니다"));
        // 모든 주소 isMain = false
        user.getAddress().forEach(addr -> addr.setIsMain(false));

        // 선택한 주소 isMain = true
        Address target = user.getAddress().stream()
            .filter(addr -> addr.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("주소가 존재하지 않음"));

        target.setIsMain(true);
    }
}

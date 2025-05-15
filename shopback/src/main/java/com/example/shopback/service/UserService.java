package com.example.shopback.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shopback.component.Role;
import com.example.shopback.dto.OrderDTO;
import com.example.shopback.dto.OrderItemDTO;
import com.example.shopback.dto.UserDTO;
import com.example.shopback.dto.UserRequestDTO;
import com.example.shopback.entity.Address;
import com.example.shopback.entity.Item;
import com.example.shopback.entity.ItemImg;
import com.example.shopback.entity.Order;
import com.example.shopback.entity.User;
import com.example.shopback.repository.OrderRepository;
import com.example.shopback.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // メールアドレスの重複確認
    public boolean checkUsernameExists(String username){
        return userRepository.existsByUsername(username);
    }

    // ニックネームの重複確認
    public boolean checkUsernicExists(String usernic){
        return userRepository.existsByUsernic(usernic);
    }

    // 入力されたパスワードと保存されたパスワードの一致確認
    public boolean matchPass(String rawPass, String encodedPassword){
        return bCryptPasswordEncoder.matches(rawPass, encodedPassword);
    }

    // 会員登録処理
    public void signUp(UserDTO userDTO){
        // パスワード確認
        if(!userDTO.getPassword().equals(userDTO.getConfirmPass())){
            throw new IllegalArgumentException("パスワードが一致しません");
        }

        // メールアドレス重複確認
        if(checkUsernameExists(userDTO.getUsername())){
            throw new IllegalArgumentException("すでに存在するメールアドレスです");
        }

        // ニックネーム重複確認
        if(checkUsernicExists(userDTO.getUsernic())){
            throw new IllegalArgumentException("すでに存在するニックネームです");
        }

        // パスワードを暗号化して保存
        String encodePass = bCryptPasswordEncoder.encode(userDTO.getPassword());

        User user = toEntity(userDTO, encodePass);
        userRepository.save(user);
    }

    // メールアドレスからユーザー情報取得（住所含む）
    public UserDTO findByUsername(String username){
        Optional<User> optionalUser = userRepository.findWithAddressByUsername(username);
        return optionalUser.map(this::toDTO).orElse(null);
    }

    // ユーザー認証処理（メールアドレス + パスワード）
    public boolean authenticate(String username, String password){
        Optional<User> optionalUser = userRepository.findWithAddressByUsername(username);

        if(!optionalUser.isPresent()){
            System.out.println("ログイン失敗: メールアドレスが存在しません");
            return false;
        }

        User user = optionalUser.get();

        if(!matchPass(password, user.getPassword())){
            System.out.println("ログイン失敗: パスワード不一致");
            return false;
        }

        System.out.println("ログイン成功: " + username);
        return true;
    }

    // 管理者用：全ユーザー一覧取得
    public List<UserRequestDTO> getAllUsers(){
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> UserRequestDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .usernic(user.getUsernic())
                        .build())
                .collect(Collectors.toList());
    }

    // 管理者用：ユーザー詳細と注文情報取得
    public UserRequestDTO getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        List<Order> orderList = orderRepository.findByUser_Username(user.getUsername());

        List<OrderDTO> orders = orderList.stream()
            .map(order -> {
                String zip = order.getOrderAddress() != null ? order.getOrderAddress().getZipcode() : "";
                String addr = order.getOrderAddress() != null ? order.getOrderAddress().getAddress() : "";

                List<OrderItemDTO> items = order.getOrderItems().stream().map(oi -> {
                    Item item = oi.getItem();
                    String imgPath = item.getItemImgs().stream()
                            .filter(ItemImg::getMainImg)
                            .map(ItemImg::getImgPath)
                            .findFirst()
                            .orElse(null);

                    return OrderItemDTO.builder()
                            .itemName(item.getItemname())
                            .itemId(item.getId())
                            .imgPath(imgPath)
                            .price(oi.getPrice())
                            .quantity(oi.getQuantity())
                            .build();
                }).toList();

                return OrderDTO.builder()
                        .orderId(order.getId())
                        .orderAt(order.getOrderAt())
                        .deliveryZip(zip)
                        .deliveryAddr(addr)
                        .items(items)
                        .build();
            }).toList();

        return UserRequestDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .usernic(user.getUsernic())
                .orders(orders)
                .build();
    }

    // 🔐 仮パスワードを発行して保存し、メールで送信
    public boolean TempPassword(String email) {
        Optional<User> optionalUser = userRepository.findByUsername(email);

        if (optionalUser.isEmpty()) return false;

        String tempPassword = UUID.randomUUID().toString().substring(0, 10);
        User user = optionalUser.get();

        user.setPassword(bCryptPasswordEncoder.encode(tempPassword));
        userRepository.save(user);

        emailService.sendTempPassword(email, tempPassword);
        return true;
    }


    // ニックネームからメールアドレス検索（ID探し）
    public String findUsernameByUsernic(String usernic){
        Optional<User> user = userRepository.findByUsernic(usernic);
        return user.map(User::getUsername).orElse(null);
    }

    // DTO → Entity 変換
    private User toEntity(UserDTO userDTO, String encodedPassword) {
        return User.builder()
                .username(userDTO.getUsername())
                .password(encodedPassword)
                .role(Role.valueOf(userDTO.getRole()))
                .usernic(userDTO.getUsernic())
                .build();
    }

    // Entity → DTO 変換（代表住所を含む）
    private UserDTO toDTO(User user) {
        String address = null;
        String zipcode = null;

        if (user.getAddress() != null && !user.getAddress().isEmpty()) {
            Address main = user.getAddress().stream()
                        .filter(addr -> Boolean.TRUE.equals(addr.getIsMain()))
                        .findFirst()
                        .orElse(null);

            if(main != null){
                address = main.getAddress();
                zipcode = main.getZipcode();
            }
        }

        return UserDTO.builder()
                .username(user.getUsername())
                .usernic(user.getUsernic())
                .role(user.getRole().name())
                .address(address)
                .zipcode(zipcode)
                .build();
    }

    // 🔐 パスワード変更処理
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();

        // 現在のパスワードが一致するか確認
        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        // 新しいパスワードをハッシュ化して保存
        String encoded = bCryptPasswordEncoder.encode(newPassword);
        user.setPassword(encoded);
        userRepository.save(user);
        return true;
    }
}

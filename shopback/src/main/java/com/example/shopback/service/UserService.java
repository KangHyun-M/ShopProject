package com.example.shopback.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shopback.component.Role;
import com.example.shopback.dto.UserDTO;
import com.example.shopback.entity.User;
import com.example.shopback.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    //이메일 중복 확인      メールアドレスの重複確認
    public boolean checkUsernameExists(String username){
        return userRepository.existsByUsername(username);
    }

    //닉네임 중복 확인      ニックネームの重複確認
    public boolean checkUsernicExists(String usernic){
        return userRepository.existsByUsernic(usernic);
    }

    


    //저장된 비밀번호와 입력한 비밀번호 비교        保存済のパスワードと入力したパスワードを比較
    public boolean matchPass(String rawPass, String encodedPassword){
        return bCryptPasswordEncoder.matches(rawPass, encodedPassword);
    }

    //회원가입 처리     会員登録処理
    public void signUp(UserDTO userDTO){
        //비밀번호 확인     パスワード確認
        if(!userDTO.getPassword().equals(userDTO.getConfirmPass())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
        }

        //메일 중복확인     メールアドレスの重複確認
        if(checkUsernameExists(userDTO.getUsername())){
            throw new IllegalArgumentException("이미 존재하는 이메일입니다");
        }

        //닉네임 중복확인   ニックネームの重複確認
        if(checkUsernicExists(userDTO.getUsernic())){
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다");
        }

        //비밀번호 인코딩   パスワードの暗号化
        String encodePass = bCryptPasswordEncoder.encode(userDTO.getPassword());

        User user = toEntity(userDTO, encodePass);
        userRepository.save(user);
    }

    //이메일로 사용자 조회      メールアドレスからユーザーを照会する
    public UserDTO findByUsername(String username){
       Optional<User> optionalUser = userRepository.findByUsername(username);
       
       //값이 존재하는지 확인후, 존재하면 DTO로 변환하여 반환  値の存否確認後、存在する場合、DTOに変換して返還する
       if(optionalUser.isPresent()){
        User user = optionalUser.get();
        return toDTO(user);
       } else{
        //값이 없을경우     値がない場合
        return null;
       }
    }

    //사용자 인증       ユーザー認証
    public boolean authenticate(String username, String password){
        Optional<User> optionalUser = userRepository.findByUsername(username);

        //값이 존재하는지 확인      値の存否確認
        if(!optionalUser.isPresent()){
            System.out.println("ログイン失敗: メールアドレスが存在しません");
            return false;
        }

        //값이 존재하면 Optional에서 User객체 추출      値が存在する場合、OptionalからUser客体取得
        User user = optionalUser.get();

        if(!matchPass(password, user.getPassword())){
            System.out.println("ログイン失敗: パスワード不一致");
            return false;
        }

        System.out.println("ログイン成功: " + username);
        return true;
    }

    // DTO를 Entity로 변환      DTOをEntityに変換
    private User toEntity(UserDTO userDTO, String encodedPassword) {
        return User.builder()
                .username(userDTO.getUsername())
                .password(encodedPassword)  // 암호화된 비밀번호 저장   暗号化されたパスワードを保存
                .role(Role.valueOf(userDTO.getRole()))
                .usernic(userDTO.getUsernic())
                .build();
    }

    //EntityをDToに変換
    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .username(user.getUsername())
                .usernic(user.getUsernic())
                .role(user.getRole().name())
                .build();
    }
    
}

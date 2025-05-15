package com.example.shopback.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopback.dto.ChangePwDTO;
import com.example.shopback.dto.UserDTO;
import com.example.shopback.dto.UserRequestDTO;
import com.example.shopback.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ 会員登録
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO) {
        try {
            userService.signUp(userDTO);
            return ResponseEntity.ok("会員登録が完了しました");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("会員登録中にエラーが発生しました");
        }
    }

    // ✅ ログイン処理（セッション方式）
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody UserDTO userDTO, HttpServletRequest request, HttpServletResponse response) {
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();

        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (passwordEncoder.matches(password, userDetails.getPassword())) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

                request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                System.out.println("ログイン成功 - ID: " + username);
                return ResponseEntity.ok("ログイン成功");
            } else {
                System.out.println("ログイン失敗 - パスワード不一致: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("IDまたはパスワードが一致しません");
            }
        } catch (Exception e) {
            System.err.println("ログイン中にエラーが発生しました: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("サーバーエラー");
        }
    }

    // ✅ ログアウト処理（セッション削除）
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            request.getSession().invalidate();
            return ResponseEntity.ok("ログアウト成功");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("ログアウト中にエラーが発生しました");
        }
    }

    // ✅ メールアドレスの重複チェック
    @PostMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestBody UserDTO userDTO) {
        String username = userDTO.getUsername();
        boolean exists = userService.checkUsernameExists(username);
        return ResponseEntity.ok(exists);
    }

    // ✅ ニックネームの重複チェック
    @PostMapping("/check-usernic")
    public ResponseEntity<Boolean> checkUsernic(@RequestBody UserDTO userDTO) {
        String usernic = userDTO.getUsernic();
        boolean exists = userService.checkUsernicExists(usernic);
        return ResponseEntity.ok(exists);
    }

    // ✅ 現在ログイン中のユーザー情報取得
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            UserDTO userDTO = userService.findByUsername(username);
            if (userDTO != null) {
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // ✅ 管理者用 - 全ユーザーリスト取得
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserRequestDTO>> getAllUsers() {
        List<UserRequestDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ 管理者用 - ユーザー詳細取得
    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<UserRequestDTO> getUserDetail(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserDetail(userId));
    }

    // ✅ ID（メールアドレス）検索：ニックネームから
    @PostMapping("/find-id")
    public ResponseEntity<String> findByUsernic(@RequestBody Map<String, String> request) {
        String usernic = request.get("usernic");
        String username = userService.findUsernameByUsernic(usernic);
        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("該当するユーザーが見つかりません");
        }
    }

    // ✅ 認証完了後、仮パスワードを発行して保存し、メールで送信
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(HttpSession session) {
        String email = (String) session.getAttribute("resetEmail");
        Boolean verified = (Boolean) session.getAttribute("resetVerified");

        if (email == null || verified == null || !verified) {
            return ResponseEntity.status(401).body("認証が完了していません");
        }

        boolean result = userService.TempPassword(email);

        // セッションの情報は一度クリアする
        session.removeAttribute("resetEmail");
        session.removeAttribute("resetVerified");
        session.removeAttribute("verificationCode");

        if (result) {
            return ResponseEntity.ok("仮パスワードをメールで送信しました");
        } else {
            return ResponseEntity.status(404).body("ユーザーが見つかりませんでした");
        }
    }

    // ✅ パスワード変更（ログイン済みユーザーのみ）
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePwDTO request, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ログインが必要です");
        }

        String username = auth.getName();
        boolean success = userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());

        if (success) {
            return ResponseEntity.ok("パスワードを変更しました");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("現在のパスワードが正しくありません");
        }
    }
}

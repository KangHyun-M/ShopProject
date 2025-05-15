package com.example.shopback.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN") // 管理者ロールのみ許可
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // ユーザーおよび管理者ロールのみ許可
                .requestMatchers(
                        "/api/signup",
                        "/api/login",
                        "/api/check-username",
                        "/api/send-auth",
                        "/api/verify-code",
                        "/api/check-usernic",
                        "/api/me",
                        "/api/items/{id}",
                        "/api/items",
                        "/api/find-id",
                        "/api/reset-password",
                        "/change-password"
                ).permitAll() // 認証不要でアクセス可能
                .anyRequest().authenticated() // 上記以外は認証が必要
        );

        // セッションの多重ログイン制限
        http.sessionManagement((auth) -> auth
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true)
                // true = セッション数を超えると新規ログインを拒否
                // false = セッション数を超えると既存セッションを無効化
        );

        // セッション固定攻撃対策レベル設定
        http.sessionManagement((auth) -> auth
                .sessionFixation().changeSessionId()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 必要に応じてセッション生成
        );

        // ログアウト処理の設定
        http.logout(auth -> auth
                .logoutUrl("/api/logout")
                .invalidateHttpSession(true) // セッションの破棄
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK); // 200 OK返却
                })
        );

        // CSRF設定：開発中は無効化、運用時に有効化推奨
        http.csrf((auth) -> auth.disable());

        // CORS設定を適用（Reactとの連携）
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(List.of("http://localhost:3000")); // Reactの開発サーバーURL
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 許可するHTTPメソッド
        corsConfig.setAllowedHeaders(List.of("*")); // 全てのヘッダーを許可
        corsConfig.setAllowCredentials(true); // 認証情報（Cookie等）の送信を許可

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // 全パスにCORS設定を適用

        return source;
    }
}

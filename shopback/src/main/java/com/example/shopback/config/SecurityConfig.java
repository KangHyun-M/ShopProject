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
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        

        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")              //어드민 권한에만 허용  ADMIN権限のみ許容
                .requestMatchers("/api/user/**").hasAnyRole("USER","ADMIN")        //유저,어드민 권한에만 허용　USER、ADMIN権限のみ許容
                .requestMatchers("/api/signup","/api/login","/api/check-username","/api/send-auth",
                "/api/verify-code","/api/check-usernic","/api/me","/api/items/{id}","/api/items").permitAll()                  //全てのAPIを許容
                .anyRequest().authenticated()                                                           //その他、認証必要
        );


        //세션의 중복로그인 허용여부　セッションの重複ログイン許可可否
        http.sessionManagement((auth) -> auth
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true)
                //true = 초과하는 경우 새로운 로그인 차단　超える場合、新しいログインを遮断
                //false = 초과하는 경우 현재 세션을 삭제   超える場合、現在のセッションを削除
        );

        //세션의 고정보호 레벨을 10으로 설정    セッションの固定保護レベルを１０に設定
        http.sessionManagement((auth) -> auth
                .sessionFixation()
                .changeSessionId()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        );

        //로그아웃관련 설정     ログアウト関連設定
        http.logout(auth -> auth
                .logoutUrl("/api/logout")
                .invalidateHttpSession(true)
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                })
        );

        //csrf관련 설정, 개발중에는 disable, 개발후 주석처리    CSRF関連設定、開発中にはDISABLEに、開発完了後にはコメント処理
        http.csrf((auth) -> auth.disable());

        http.cors(cors -> cors.configurationSource(corsConfigurationSource())); //커스텀 CORS 설정 사용 カスタマイズCORS設定使用

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(List.of("http://localhost:3000")); //리액트 주소  リアクトのポート設定
        corsConfig.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true); //쿠키, 인증을 헤더에 적용　クッキー、認証をヘダーに適用

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); //모든 경로에 대해 설정    全てのURLに対して設定

        return source;
    }
}

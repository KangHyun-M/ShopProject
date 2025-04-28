package com.example.shopback.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")              //어드민 권한에만 허용
                .requestMatchers("/api/user/**").hasAnyRole("USER","ADMIN")        //유저,어드민 권한에만 허용
                .requestMatchers("/api/signup","/api/login").permitAll()                    //모든 유저에 허용
                .anyRequest().authenticated()                                                           //그 외에는 인증 필요
        );


        //세션의 중복로그인 허용여부
        http.sessionManagement((auth) -> auth
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true)
                //true = 초과하는 경우 새로운 로그인 차단
                //false = 초과하는 경우 현재 세션을 삭제
        );

        //세션의 고정보호 레벨을 10으로 설정
        http.sessionManagement((auth) -> auth
                .sessionFixation()
                .changeSessionId()
        );

        //로그아웃관련 설정
        http.logout(auth -> auth
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
        );

        //csrf관련 설정, 개발중에는 disable, 개발후 주석처리
        http.csrf((auth) -> auth.disable());

        http.cors(cors -> cors.configurationSource(corsConfigurationSource())); // ✅ 커스텀 CORS 설정 사용

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:3000")); //리액트 주소
        corsConfig.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true); //쿠기, 인증을 헤더에 적용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); //모든 경로에 대해 설정

        return source;
    }
}

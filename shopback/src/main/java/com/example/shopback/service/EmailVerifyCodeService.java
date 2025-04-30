package com.example.shopback.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shopback.entity.EmailVerification;
import com.example.shopback.repository.EmailVerificationRepository;

@Service
public class EmailVerifyCodeService {
    
    @Autowired
    EmailVerificationRepository emailVerificationRepository;

    public boolean verifyCode(String username, String verificationCode){
        //DB에서 이메일과 인증번호 찾기
        Optional<EmailVerification> verificationRecordOpt = emailVerificationRepository
                .findByUsernameAndVerificationCode(username, verificationCode);

        if(verificationRecordOpt.isEmpty()){
            //인증번호가 존재하지 않으면 실패
            return false;
        }

        EmailVerification verificationRecord = verificationRecordOpt.get();

        //인증번호가 만료되었는지 확인 (5분)
        LocalDateTime now = LocalDateTime.now();
        if(verificationRecord.getExpiredAt().isBefore(now)){
            //인증번호가 만료되었으면 실패
            return false;
        }

        //인증번호가 일치하고, 만료되지 않은 경우 성고
        return true;
    }

    //인증번호 발송 및 저장
    public void sendVerificationCode(String username, String verificationCode){
        //인증번호 생성

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiredAt = now.plusMinutes(5);

        //이메일 인증 정보 저장
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUsername(username);
        emailVerification.setVerificationCode(verificationCode);
        emailVerification.setCreateAt(now);
        emailVerification.setExpiredAt(expiredAt);

        emailVerificationRepository.save(emailVerification);
    }
}

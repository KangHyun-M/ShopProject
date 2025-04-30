import React, { useState } from "react";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import "../static/Signup.css"; // 스타일 파일 임포트

export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    usernic: "",
    verificationCode: "",
    confirmPass: "",
    role: "USER",
  });
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPwValid, setIsPwValid] = useState(false);
  const [isConfirmPwValid, setIsConfirmPwValid] = useState(false);
  const [isUsernicValid, setIsUsernicValid] = useState(false);
  const [isAuthValid, setIsAuthValid] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const checkUsername = async () => {
    try {
      const res = await axiosInstance.post("/check-username", {
        username: user.username,
      });
      if (res.data.exists) {
        Swal.fire({
          icon: "error",
          title: "이미 사용중인 이메일입니다",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "사용 가능한 이메일입니다",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "이메일 확인중 오류가 발생했습니다",
      });
    }
  };

  const sendAuth = async () => {
    if (
      !user.username.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    ) {
      Swal.fire({
        icon: "warning",
        title: "이메일 형식에 맞게 입력해주세요",
      });
      return;
    }

    try {
      await axiosInstance.post("/send-auth", { username: user.username });
      Swal.fire({
        icon: "success",
        title: "인증번호를 이메일로 전송했습니다",
      });
      setIsAuthValid(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "이메일로 인증번호 전송중 오류가 발생했습니다",
      });
    }
  };

  const verifyAuth = async () => {
    try {
      const res = await axiosInstance.post("/verify-code", {
        verificationCode: user.verificationCode,
      });
      if (res.data) {
        Swal.fire({
          icon: "success",
          title: "인증이 완료되었습니다",
        });
        setIsAuthValid(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "인증번호가 틀렸습니다",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "인증 확인중 오류가 발생했습니다",
      });
    }
  };

  const checkUserNic = async () => {
    try {
      const res = await axiosInstance.post("/check-usernic", {
        usernic: user.usernic,
      });
      if (res.data.exists) {
        Swal.fire({
          icon: "error",
          title: "이미 존재하는 닉네임입니다",
        });
        setIsUsernicValid(false);
      } else {
        Swal.fire({
          icon: "success",
          title: "사용 가능한 닉네임입니다",
        });
        setIsUsernicValid(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "닉네임 중복 확인중 오류가 발생했습니다",
      });
      setIsUsernicValid(false);
    }
  };

  const validateUsername = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsUsernameValid(regex.test(email));
  };

  const validatePasswords = () => {
    const isPwValid = user.password.length >= 8;
    const isConfirmPwValid = user.password === user.confirmPass;

    setIsPwValid(isPwValid);
    setIsConfirmPwValid(isConfirmPwValid);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/signup", user);
      Swal.fire({
        icon: "success",
        title: "회원가입 완료",
        text: "회원가입이 완료되었습니다",
      });
      window.location.href = "/";
    } catch (error) {
      console.log("회원가입 에러:", error.response?.data || error.message);
    }
  };

  const validateForm = () => {
    return (
      isUsernameValid &&
      isPwValid &&
      isConfirmPwValid &&
      isUsernicValid &&
      isAuthValid
    );
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>회원가입</h2>
        <form onSubmit={handleSumbit}>
          {/* 아이디 중복 확인 */}
          <div className="form-group">
            <input
              type="email"
              id="username"
              value={user.username}
              onChange={(e) => {
                handleChange(e);
                validateUsername(e.target.value); // 이메일 유효성 검사
              }}
              placeholder="E-mail"
              required
            />
            <button type="button" onClick={checkUsername}>
              이메일 중복 확인
            </button>
          </div>

          {/* 인증번호 입력 */}
          <div className="form-group button-group">
            <input
              type="text"
              id="verificationCode"
              value={user.verificationCode}
              onChange={handleChange}
              placeholder="인증번호 입력"
              disabled={!isUsernameValid}
            />
            <button type="button" onClick={sendAuth}>
              인증번호 발송
            </button>
            <button type="button" onClick={verifyAuth} disabled={!isAuthValid}>
              인증번호 확인
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => {
                handleChange(e);
                validatePasswords(); // 비밀번호 유효성 검사
              }}
              placeholder="비밀번호"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <input
              type="password"
              id="confirmPass"
              value={user.confirmPass}
              onChange={(e) => {
                handleChange(e);
                validatePasswords(); // 비밀번호 확인 유효성 검사
              }}
              placeholder="비밀번호 확인"
              required
            />
          </div>

          {/* 닉네임 입력 */}
          <div className="form-group">
            <input
              type="text"
              id="usernic"
              value={user.usernic}
              onChange={handleChange}
              placeholder="닉네임"
              required
            />
            <button type="button" onClick={checkUserNic}>
              닉네임 중복 확인
            </button>
          </div>

          <button type="submit" disabled={!validateForm()}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

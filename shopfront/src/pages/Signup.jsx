import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import "../css/Signup.css"; // 스타일 파일 임포트

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

  // 비밀번호 유효성 검사
  const validatePasswords = useCallback(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/; // 영어 대소문자 + 숫자 + 특수문자, 8~15자
    const isPwValid = passwordRegex.test(user.password);
    const isConfirmPwValid = user.password === user.confirmPass;

    setIsPwValid(isPwValid);
    setIsConfirmPwValid(isConfirmPwValid);
  }, [user.password, user.confirmPass]);

  // 닉네임 유효성 검사
  const validateUsernic = useCallback(() => {
    const usernicRegex = /^[a-zA-Z0-9]{1,15}$/; // 영어 대소문자 + 숫자, 15자 이하
    setIsUsernicValid(usernicRegex.test(user.usernic));
  }, [user.usernic]);

  // 이메일 유효성 검사
  const validateUsername = useCallback(() => {
    const usernameRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // 이메일 형식 검사
    setIsUsernameValid(usernameRegex.test(user.username)); // 유효성 검사 수행
  }, [user.username]);

  useEffect(() => {
    validatePasswords();
    validateUsernic();
    validateUsername();
  }, [validatePasswords, validateUsernic, validateUsername]); // 의존성 배열에 함수 추가

  const handleChange = (e) => {
    const { id, value } = e.target;

    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [id]: value };

      if (id === "password" || id === "confirmPass") {
        validatePasswords();
      }

      if (id === "usernic") {
        validateUsernic();
      }

      if (id === "username") {
        validateUsername();
      }

      return updatedUser;
    });
  };

  const checkUsername = async () => {
    try {
      const res = await axiosInstance.post("/check-username", {
        username: user.username,
      });
      if (res.data) {
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
      await axiosInstance.post("/send-auth", null, {
        params: { username: user.username },
      });
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
        username: user.username,
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
      if (res.data) {
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

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!isAuthValid) {
      Swal.fire({
        icon: "warning",
        title: "이메일 인증이 완료되지 않았습니다",
      });
      return;
    }

    try {
      const userPayload = { ...user, verificationCode: user.verificationCode };
      await axiosInstance.post("/signup", userPayload);
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
            {user.password && !isPwValid && (
              <span className="error-message">
                비밀번호는 8자 이상, 15자 이하, 영어 대소문자, 숫자, 특수문자를
                포함해야 합니다.
              </span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <input
              type="password"
              id="confirmPass"
              value={user.confirmPass}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              required
            />
            {user.confirmPass && !isConfirmPwValid && (
              <span className="error-message">
                비밀번호가 일치하지 않습니다
              </span>
            )}
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
            {user.usernic && !isUsernicValid && (
              <span className="error-message">
                닉네임은 영어 대소문자와 숫자 조합으로 15자 이내여야 합니다.
              </span>
            )}
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

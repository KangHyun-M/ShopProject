import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import "../css/Signup.css";

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

  // 비밀번호 유효성 검사 パスワードバリデーション
  const validatePasswords = useCallback(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/; //英語大小文字+数字+特殊文字の 8~15字
    const isPwValid = passwordRegex.test(user.password);
    const isConfirmPwValid = user.password === user.confirmPass;

    setIsPwValid(isPwValid);
    setIsConfirmPwValid(isConfirmPwValid);
  }, [user.password, user.confirmPass]);

  // 닉네임 유효성 검사　ニックネームバリデーション
  const validateUsernic = useCallback(() => {
    const usernicRegex = /^[a-zA-Z0-9]{1,15}$/; // 英語大小文字+数字, 15字以下
    setIsUsernicValid(usernicRegex.test(user.usernic));
  }, [user.usernic]);

  // 이메일 유효성 검사 メールアドレスバリデーション
  const validateUsername = useCallback(() => {
    const usernameRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsUsernameValid(usernameRegex.test(user.username));
  }, [user.username]);

  useEffect(() => {
    validatePasswords();
    validateUsernic();
    validateUsername();
  }, [validatePasswords, validateUsernic, validateUsername]);

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
          title: "存在するメールアドレスです",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "使えるメールアドレスです",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "メールアドレス確認中にエラー発生しました",
      });
    }
  };

  const sendAuth = async () => {
    if (
      !user.username.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    ) {
      Swal.fire({
        icon: "warning",
        title: "正しいメールアドレスを入力してください",
      });
      return;
    }

    try {
      await axiosInstance.post("/send-auth", null, {
        params: { username: user.username },
      });
      Swal.fire({
        icon: "success",
        title: "メールアドレスに認証番号を送信しました",
      });
      setIsAuthValid(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "メールアドレスに認証番号を送信中にエラー発生しました",
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
          title: "認証完了",
        });
        setIsAuthValid(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "正しい認証番号を入力してください",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "認証中にエラー発生しました",
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
          title: "存在するニックネームです",
        });
        setIsUsernicValid(false);
      } else {
        Swal.fire({
          icon: "success",
          title: "使えるニックネームです",
        });
        setIsUsernicValid(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ニックネームの重複確認中にエラー発生しました",
      });
      setIsUsernicValid(false);
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!isAuthValid) {
      Swal.fire({
        icon: "warning",
        title: "メールアドレスに認証を完了してください",
      });
      return;
    }

    try {
      const userPayload = { ...user, verificationCode: user.verificationCode };
      await axiosInstance.post("/signup", userPayload);
      Swal.fire({
        icon: "success",
        title: "会員登録完了",
        text: "会員登録完了",
      });
      window.location.href = "/";
    } catch (error) {
      console.log("会員登録エラー:", error.response?.data || error.message);
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
        <h2>会員登録</h2>
        <form onSubmit={handleSumbit}>
          {/* ID重複確認 */}
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
              メール重複確認
            </button>
          </div>

          {/* 認証番号入力 */}
          <div className="form-group button-group">
            <input
              type="text"
              id="verificationCode"
              value={user.verificationCode}
              onChange={handleChange}
              placeholder="認証番号を入力してください"
              disabled={!isUsernameValid}
            />
            <button type="button" onClick={sendAuth}>
              認証番号送信
            </button>
            <button type="button" onClick={verifyAuth} disabled={!isAuthValid}>
              認証番号確認
            </button>
          </div>

          {/* パスワード */}
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder="パスワードを入力してください"
              required
            />
            {user.password && !isPwValid && (
              <span className="error-message">
                パスワードは英語の大小文字、数字、特殊文字を含めた8字以上、15字以下
                にしてください
              </span>
            )}
          </div>

          {/* パスワード確認 */}
          <div className="form-group">
            <input
              type="password"
              id="confirmPass"
              value={user.confirmPass}
              onChange={handleChange}
              placeholder="パスワード確認"
              required
            />
            {user.confirmPass && !isConfirmPwValid && (
              <span className="error-message">パスワードが一致しません</span>
            )}
          </div>

          {/* ニックネーム */}
          <div className="form-group">
            <input
              type="text"
              id="usernic"
              value={user.usernic}
              onChange={handleChange}
              placeholder="ニックネームを入力してください"
              required
            />
            {user.usernic && !isUsernicValid && (
              <span className="error-message">
                ニックネームは英語の大小文字と数字の15字以内でしてください
              </span>
            )}
            <button type="button" onClick={checkUserNic}>
              ニックネーム重複確認
            </button>
          </div>

          <button type="submit" disabled={!validateForm()}>
            会員登録
          </button>
        </form>
      </div>
    </div>
  );
}

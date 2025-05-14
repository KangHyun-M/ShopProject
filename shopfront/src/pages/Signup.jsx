// src/pages/Signup.jsx
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";

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

  const validatePasswords = useCallback(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
    setIsPwValid(passwordRegex.test(user.password));
    setIsConfirmPwValid(user.password === user.confirmPass);
  }, [user.password, user.confirmPass]);

  const validateUsernic = useCallback(() => {
    const usernicRegex = /^[a-zA-Z0-9]{1,15}$/;
    setIsUsernicValid(usernicRegex.test(user.usernic));
  }, [user.usernic]);

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
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const checkUsername = async () => {
    try {
      const res = await axiosInstance.post("/check-username", {
        username: user.username,
      });
      Swal.fire({
        icon: res.data ? "error" : "success",
        title: res.data
          ? "存在するメールアドレスです"
          : "使えるメールアドレスです",
      });
    } catch {
      Swal.fire({ icon: "error", title: "メールアドレス確認エラー" });
    }
  };

  const sendAuth = async () => {
    if (!isUsernameValid) {
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
      Swal.fire({ icon: "success", title: "認証番号を送信しました" });
    } catch {
      Swal.fire({ icon: "error", title: "認証番号送信失敗" });
    }
  };

  const verifyAuth = async () => {
    try {
      const res = await axiosInstance.post("/verify-code", {
        username: user.username,
        verificationCode: user.verificationCode,
      });
      Swal.fire({
        icon: res.data ? "success" : "error",
        title: res.data ? "認証完了" : "認証番号が正しくありません",
      });
      if (res.data) setIsAuthValid(true);
    } catch {
      Swal.fire({ icon: "error", title: "認証中にエラー発生しました" });
    }
  };

  const checkUserNic = async () => {
    try {
      const res = await axiosInstance.post("/check-usernic", {
        usernic: user.usernic,
      });
      Swal.fire({
        icon: res.data ? "error" : "success",
        title: res.data ? "存在するニックネームです" : "使えるニックネームです",
      });
      setIsUsernicValid(!res.data);
    } catch {
      Swal.fire({ icon: "error", title: "ニックネーム確認中エラー" });
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isAuthValid) {
      Swal.fire({ icon: "warning", title: "メール認証を完了してください" });
      return;
    }
    try {
      await axiosInstance.post("/signup", user);
      Swal.fire({ icon: "success", title: "会員登録完了" }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      console.error("登録エラー", error);
    }
  };

  const validateForm = () =>
    isUsernameValid &&
    isPwValid &&
    isConfirmPwValid &&
    isUsernicValid &&
    isAuthValid;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow">
            <h3 className="text-center mb-4">📝 会員登録</h3>
            <Form onSubmit={handleSumbit}>
              <Form.Group className="mb-3">
                <Form.Label>メールアドレス</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="username"
                    value={user.username}
                    onChange={handleChange}
                    type="email"
                    placeholder="E-mail"
                    required
                  />
                  <Button variant="outline-secondary" onClick={checkUsername}>
                    重複確認
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>認証番号</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="verificationCode"
                    value={user.verificationCode}
                    onChange={handleChange}
                    placeholder="認証番号"
                    disabled={!isUsernameValid}
                  />
                  <Button variant="outline-primary" onClick={sendAuth}>
                    送信
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={verifyAuth}
                    disabled={!isUsernameValid}
                  >
                    確認
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>パスワード</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="8~15字, 特殊文字含む"
                  isInvalid={user.password && !isPwValid}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  パスワードは英数字+特殊文字を含めて8~15字で入力してください
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>パスワード確認</Form.Label>
                <Form.Control
                  type="password"
                  id="confirmPass"
                  value={user.confirmPass}
                  onChange={handleChange}
                  placeholder="確認のため再入力"
                  isInvalid={user.confirmPass && !isConfirmPwValid}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  パスワードが一致しません
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ニックネーム</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="usernic"
                    value={user.usernic}
                    onChange={handleChange}
                    placeholder="ニックネーム"
                    isInvalid={user.usernic && !isUsernicValid}
                    required
                  />
                  <Button variant="outline-secondary" onClick={checkUserNic}>
                    重複確認
                  </Button>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  英数字15字以内で入力してください
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" disabled={!validateForm()}>
                  登録する
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

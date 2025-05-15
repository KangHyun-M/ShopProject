import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom"; // ✅ 追加

export default function FindPassword() {
  const [email, setEmail] = useState(""); // 📧 入力されたメールアドレス
  const [code, setCode] = useState(""); // 🔢 入力された認証コード
  const [step, setStep] = useState(1); // 現在のステップ（1=メール送信, 2=コード入力）
  const navigate = useNavigate(); // ✅ ページ移動用

  // 📩 認証コード送信処理
  const handleSendCode = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/send-auth", null, {
        params: { username: email },
      });

      Swal.fire(
        "確認",
        "認証コードを送信しました。メールをご確認ください。",
        "success"
      );
      setStep(2);
    } catch (err) {
      console.error("送信エラー:", err);
      Swal.fire("エラー", "メール送信に失敗しました", "error");
    }
  };

  // ✅ 認証コード検証処理
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/verify-code", {
        username: email,
        verificationCode: code,
      });

      if (res.data === true) {
        // 🔐 認証成功 → 仮パスワード発行
        await axiosInstance.post("/reset-password");

        Swal.fire("完了", "仮パスワードをメールで送信しました", "success").then(
          () => {
            // ✅ ログインページへ移動
            navigate("/login");
          }
        );
      } else {
        Swal.fire("エラー", "認証コードが一致しません", "error");
      }
    } catch (err) {
      console.error("検証エラー:", err);
      Swal.fire("エラー", "検証処理に失敗しました", "error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px", padding: "30px" }}>
        <h4 className="mb-4 text-center fw-bold text-primary">
          🔑 パスワード再発行
        </h4>

        {step === 1 && (
          <Form onSubmit={handleSendCode}>
            <Form.Group className="mb-3">
              <Form.Label>登録したメールアドレス</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                認証コード送信
              </Button>
            </div>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleVerifyCode}>
            <Form.Group className="mb-3">
              <Form.Label>メールに送られた認証コード</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6桁の英数字を入力"
                required
              />
            </Form.Group>
            <div className="d-grid mb-2">
              <Button type="submit" variant="success">
                仮パスワードを受け取る
              </Button>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setStep(1);
                  setCode("");
                }}
              >
                🔁 メールアドレスを変更
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}

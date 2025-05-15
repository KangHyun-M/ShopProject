import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState(""); // 現在のパスワード
  const [newPassword, setNewPassword] = useState(""); // 新しいパスワード
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      // パスワード変更リクエスト送信
      const res = await axiosInstance.post("/change-password", {
        currentPassword,
        newPassword,
      });

      // 成功アラート → ログアウト処理 → ログインページにリダイレクト
      Swal.fire("成功", res.data, "success").then(async () => {
        try {
          await axiosInstance.post("/logout"); // セッション削除（ログアウト）
          navigate("/login"); // ログイン画面へリダイレクト
        } catch (logoutErr) {
          console.error("ログアウト失敗:", logoutErr);
          Swal.fire("エラー", "ログアウトに失敗しました", "error");
        }
      });
    } catch (err) {
      console.error("パスワード変更エラー:", err);
      Swal.fire("エラー", err.response?.data || "変更に失敗しました", "error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px", padding: "30px" }}>
        <h4 className="mb-4 text-center fw-bold text-primary">
          🔒 パスワード変更
        </h4>
        <Form onSubmit={handleChangePassword}>
          <Form.Group className="mb-3">
            <Form.Label>現在のパスワード</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>新しいパスワード</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary">
              パスワードを変更する
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

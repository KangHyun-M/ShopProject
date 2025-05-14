// src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../component/authContext";
import { Form, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password, from);
    } catch (error) {
      console.error("ログイン要求失敗: ", error);
      Swal.fire("エラー", "ログイン中にエラーが発生しました", "error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold text-primary">🔐 ログイン</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="IDを入力してください"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力してください"
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                style={{
                  padding: "10px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                ログイン
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

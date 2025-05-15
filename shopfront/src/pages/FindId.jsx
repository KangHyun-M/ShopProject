import React, { useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import Swal from "sweetalert2";

export default function FindId() {
  const [usernic, setUsernic] = useState("");
  const [foundId, setFoundId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoundId("");
    setError("");

    try {
      const res = await axiosInstance.post("/find-id", { usernic });
      setFoundId(res.data);
      Swal.fire("✅ 成功", "メールアドレスは: " + res.data, "success");
    } catch (err) {
      console.error("ID検索失敗", err);
      setError("該当するユーザーが見つかりません");
      Swal.fire("❌ エラー", "該当するユーザーが見つかりません", "error");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "500px" }}>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-4">🔍 ID検索</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>ニックネーム</Form.Label>
            <Form.Control
              type="text"
              value={usernic}
              onChange={(e) => setUsernic(e.target.value)}
              placeholder="ニックネームを入力"
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary">
              IDを検索
            </Button>
          </div>
        </Form>

        {foundId && (
          <Alert variant="success" className="mt-4">
            登録されたメールアドレス: <strong>{foundId}</strong>
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        )}
      </Card>
    </Container>
  );
}

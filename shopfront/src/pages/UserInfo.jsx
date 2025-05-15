import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";

export default function UserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ユーザー情報を取得（ログインしていない場合はログインページへ）
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("ユーザー情報の読み込みに失敗", err);
        alert("管理者またはユーザーのみアクセス可能です");
        navigate("/login");
      });
  }, [navigate]);

  // ローディング中表示
  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">ローディング中...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* ユーザー情報カード */}
      <Card className="p-4 shadow-sm">
        <Card.Title className="mb-4">👤 マイプロフィール</Card.Title>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>メールアドレス：</strong>
          </Col>
          <Col>{user.username}</Col>
        </Row>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>ニックネーム：</strong>
          </Col>
          <Col>{user.usernic}</Col>
        </Row>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>権限：</strong>
          </Col>
          <Col>{user.role === "ADMIN" ? "管理者" : "ユーザー"}</Col>
        </Row>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>住所：</strong>
          </Col>
          <Col>{user.address || "登録された住所がありません"}</Col>
        </Row>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>郵便番号：</strong>
          </Col>
          <Col>{user.zipcode || "-"}</Col>
        </Row>
      </Card>
    </Container>
  );
}

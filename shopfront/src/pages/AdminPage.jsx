import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import { Container, Button, Card, Row, Col } from "react-bootstrap";

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ユーザーが管理者かどうかをチェック（そうでなければリダイレクト）
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          Swal.fire("アクセス拒否", "管理者しかアクセスできません", "warning");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("ログインエラー", "ログインしてください", "error");
        navigate("/login");
      });
  }, [navigate]);

  // 商品登録ページへ遷移
  const goToProductForm = () => {
    navigate("/admin/itemregistration");
  };

  // 商品一覧ページへ遷移
  const goToItemList = () => {
    navigate("/admin/items");
  };

  // ユーザー一覧ページへ遷移
  const goToUserList = () => {
    navigate("/admin/users");
  };

  // 削除された商品一覧ページへ遷移
  const goToDeletedItems = () => {
    navigate("/admin/items/deleted");
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">管理者ページ</h2>
      <p className="text-center text-muted mb-5">
        管理者しかアクセスできません
      </p>

      {/* 管理用機能のカード一覧 */}
      <Row className="justify-content-center">
        {/* 商品登録 */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="text-center">商品登録</Card.Title>
              <Card.Text className="text-muted text-center">
                新しい商品を追加します
              </Card.Text>
              <div className="d-grid">
                <Button variant="primary" onClick={goToProductForm}>
                  商品登録ページへ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 商品一覧 */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="text-center">商品一覧</Card.Title>
              <Card.Text className="text-muted text-center">
                登録済み商品の管理・編集・削除
              </Card.Text>
              <div className="d-grid">
                <Button variant="outline-primary" onClick={goToItemList}>
                  商品一覧へ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 削除商品管理 */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="text-center">削除商品管理</Card.Title>
              <Card.Text className="text-muted text-center">
                削除された商品を復元または確認します
              </Card.Text>
              <div className="d-grid">
                <Button variant="outline-success" onClick={goToDeletedItems}>
                  削除商品ページへ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ユーザー管理 */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title className="text-center">ユーザー管理</Card.Title>
              <Card.Text className="text-muted text-center">
                登録済みユーザーの確認と注文履歴の閲覧
              </Card.Text>
              <div className="d-grid">
                <Button variant="outline-dark" onClick={goToUserList}>
                  ユーザー一覧へ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

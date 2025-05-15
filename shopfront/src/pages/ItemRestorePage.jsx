import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function ItemRestorePage() {
  const [items, setItems] = useState([]);

  // 削除された商品一覧を取得
  useEffect(() => {
    axiosInstance
      .get("/admin/items/deleted")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("削除された商品データの取得に失敗しました", err);
        Swal.fire("エラー", "削除された商品を取得できません", "error");
      });
  }, []);

  // 商品復旧処理
  const handleRestore = (id) => {
    Swal.fire({
      title: "復元確認",
      text: "この商品を復元してもよろしいですか？",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "はい、復元する",
      cancelButtonText: "キャンセル",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .put(`/admin/items/${id}/restore`) // ← オリジナルは誤字「retore」
          .then(() => {
            Swal.fire("成功", "商品が復元されました", "success");
            setItems((prev) => prev.filter((item) => item.id !== id));
          })
          .catch(() => {
            Swal.fire("エラー", "復元に失敗しました", "error");
          });
      }
    });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🗃️ 削除された商品の復元</h2>

      {/* 商品カード一覧 */}
      <Row>
        {items.length > 0 ? (
          items.map((item) => (
            <Col key={item.id} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={item.imagePaths?.[0] || "/images/default.png"}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <Card.Body className="text-center">
                  <Card.Title className="fs-6 fw-bold">
                    {item.itemname}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-1">
                    {item.category}
                  </Card.Text>
                  <Card.Text className="fw-bold text-primary">
                    {item.price.toLocaleString()}円
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center bg-white">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleRestore(item.id)}
                  >
                    ✅ 復元
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          // 商品が存在しない場合
          <p className="text-center text-muted">
            現在、復元可能な商品はありません。
          </p>
        )}
      </Row>
    </Container>
  );
}

import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function ItemRestorePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/items/deleted")
      .then((res) => setItems(res.data))
      .catch((err) =>
        console.error("削除された商品データの取得に失敗しました", err)
      );
  }, []);

  const handleRestore = (id) => {
    if (window.confirm("該当する商品を復旧しますか?")) {
      axiosInstance
        .put(`/admin/items/${id}/retore`)
        .then(() => {
          alert("復旧完了");
          setItems((prev) => prev.filter((item) => item.id !== id));
        })
        .catch(() => alert("復旧失敗"));
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">削除された商品を復旧</h2>
      <Row>
        {items.length > 0 ? (
          items.map((item) => (
            <Col key={item.id} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.imagePaths?.[0] || "/images/default.png"}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <Card.Body className="text-center">
                  <Card.Title className="fs-6">{item.itemname}</Card.Title>
                  <Card.Text className="text-muted">{item.category}</Card.Text>
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
                    復旧
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">削除された商品が存在しません</p>
        )}
      </Row>
    </Container>
  );
}

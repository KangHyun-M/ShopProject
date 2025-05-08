import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function ItemRestorePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/items/deleted")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("삭제된 상품 불러오기 실패", err));
  }, []);

  const handleRestore = (id) => {
    if (window.confirm("해당 상품을 복구하시겠습니까?")) {
      axiosInstance
        .put(`/admin/items/${id}/retore`)
        .then(() => {
          alert("복구 완료");
          setItems((prev) => prev.filter((item) => item.id !== id));
        })
        .catch(() => alert("복구 실패"));
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">삭제된 상품 복구</h2>
      <Row>
        {items.length > 0 ? (
          items.map((item) => (
            <Col key={item.id} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.imagePaths?.[0] || "/default.png"}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <Card.Body className="text-center">
                  <Card.Title className="fs-6">{item.itemname}</Card.Title>
                  <Card.Text className="text-muted">{item.category}</Card.Text>
                  <Card.Text className="fw-bold text-primary">
                    {item.price.toLocaleString()}원
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center bg-white">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleRestore(item.id)}
                  >
                    복구
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">삭제된 상품이 없습니다.</p>
        )}
      </Row>
    </Container>
  );
}

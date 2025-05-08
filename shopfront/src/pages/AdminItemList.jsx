// src/pages/admin/AdminItemList.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { categories } from "../component/categories";

export default function AdminItemList() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          alert("관리자만 접근 가능합니다.");
          navigate("/");
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다.");
        navigate("/login");
      });

    axiosInstance
      .get("/items") // 관리자 전용이면 "/admin/items"로 바꾸세요
      .then((res) => setItems(res.data))
      .catch((err) => console.error("상품 불러오기 실패", err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.put(`/admin/items/${id}/delete`);
      alert("삭제되었습니다.");
      window.location.reload(); // 또는 setItems()로 갱신
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axiosInstance.put(`/admin/items/${id}/restore`);
      alert("복구되었습니다.");
      window.location.reload();
    } catch (err) {
      console.error("복구 실패", err);
      alert("복구에 실패했습니다.");
    }
  };

  const filteredItems =
    selectedCategory === "전체 보기"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">상품 관리</h2>

      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <Button
            size="sm"
            variant={
              selectedCategory === "전체 보기" ? "primary" : "outline-secondary"
            }
            onClick={() => setSelectedCategory("전체 보기")}
          >
            전체 보기
          </Button>
        </Col>
        {categories.map((category, idx) => (
          <Col xs="auto" key={idx}>
            <Button
              size="sm"
              variant={
                selectedCategory === category ? "primary" : "outline-secondary"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </Col>
        ))}
      </Row>

      <Row>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Col key={item.id} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className={`h-100 shadow-sm ${
                  item.deleted ? "opacity-50" : ""
                }`}
              >
                <Card.Img
                  variant="top"
                  src={item.imagePaths?.[0] || "/images/default.png"}
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
                  {item.deleted ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(item.id)}
                    >
                      복구
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => navigate(`/admin/items/edit/${item.id}`)}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">
            해당 카테고리에 상품이 없습니다.
          </p>
        )}
      </Row>
    </Container>
  );
}

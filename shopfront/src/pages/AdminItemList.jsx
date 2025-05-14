import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { categories } from "../component/categories";
import Swal from "sweetalert2";

export default function AdminItemList() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Total");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          Swal.fire("アクセス拒否", "管理者しかアクセスできません", "warning");
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire("ログインエラー", "ログインしてください", "error");
        navigate("/login");
      });

    axiosInstance
      .get("/items")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("商品リスト取得失敗", err);
        Swal.fire("エラー", "商品リストの取得に失敗しました", "error");
      });
  }, [navigate]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "確認",
      text: "本当に削除しますか?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "はい",
      cancelButtonText: "キャンセル",
    });
    if (!result.isConfirmed) return;

    try {
      await axiosInstance.put(`/admin/items/${id}/delete`);
      Swal.fire("削除完了", "商品が削除されました", "success");
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, deleted: true } : item))
      );
    } catch (err) {
      console.error("削除失敗", err);
      Swal.fire("エラー", "削除に失敗しました", "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axiosInstance.put(`/admin/items/${id}/restore`);
      Swal.fire("復旧完了", "商品が復旧されました", "success");
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, deleted: false } : item
        )
      );
    } catch (err) {
      console.error("復旧失敗", err);
      Swal.fire("エラー", "復旧に失敗しました", "error");
    }
  };

  const filteredItems =
    selectedCategory === "Total"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">商品管理</h2>

      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <Button
            size="sm"
            variant={
              selectedCategory === "Total" ? "primary" : "outline-secondary"
            }
            onClick={() => setSelectedCategory("Total")}
          >
            Total
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
                    {item.price.toLocaleString()}円
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center bg-white">
                  {item.deleted ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(item.id)}
                    >
                      復旧
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => navigate(`/admin/items/edit/${item.id}`)}
                      >
                        修正
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        削除
                      </Button>
                    </>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">
            該当するカテゴリーに商品が存在しません
          </p>
        )}
      </Row>
    </Container>
  );
}

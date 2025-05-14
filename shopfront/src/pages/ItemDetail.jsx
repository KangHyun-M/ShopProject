// src/pages/ItemDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Image,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axiosInstance
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) =>
        console.error("商品データの読み込み中にエラーが発生しました", err)
      );
  }, [id]);

  const addToCart = () => {
    axiosInstance
      .post("/user/cart", {
        itemId: item.id,
        quantity: quantity,
      })
      .then(() => {
        Swal.fire("成功", "カートに追加しました!", "success");
      })
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          Swal.fire("ログインエラー", "ログインしてください", "warning").then(
            () => {
              navigate("/login", { state: { from: location } });
            }
          );
        } else {
          Swal.fire("エラー", "カートに追加失敗", "error");
          console.error(err);
        }
      });
  };

  if (!item)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">商品データの読み込み中です…</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm border-0">
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            {item.imagePaths?.length > 0 ? (
              <Carousel variant="dark" interval={null}>
                {item.imagePaths.map((path, idx) => (
                  <Carousel.Item key={idx}>
                    <Image
                      src={path}
                      alt={`商品イメージ ${idx + 1}`}
                      fluid
                      style={{
                        height: "400px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <Image
                src="/images/default.png"
                alt="デフォルトイメージ"
                fluid
                style={{
                  height: "400px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa",
                }}
              />
            )}
          </Col>

          <Col md={6}>
            <h2 className="fw-bold mb-3">{item.itemname}</h2>
            <p className="text-muted">カテゴリー: {item.category}</p>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3 fw-semibold">数量</Form.Label>
              <Form.Select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: "100px" }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <h4 className="text-primary fw-bold mb-3">
              {item.price.toLocaleString()} 円
            </h4>

            <div className="text-start">
              <Button variant="primary" onClick={addToCart} className="px-4">
                カートに追加
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 mt-4 shadow-sm border-0">
        <h4 className="fw-bold mb-3">📘 商品詳細</h4>
        <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
      </Card>
    </Container>
  );
}

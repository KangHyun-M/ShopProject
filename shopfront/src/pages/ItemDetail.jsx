import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Image,
  Spinner,
  Button,
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
        alert("カートに追加しました!");
      })
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert("ログインしてください");
          navigate("/login", { state: { from: location } });
        } else {
          alert("カートに追加失敗");
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
          {/* 左側：イメージ */}
          <Col md={6}>
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

          {/* 右側: 商品情報 */}
          <Col md={6}>
            <h2 className="fw-bold mb-3">{item.itemname}</h2>
            <p className="text-muted">カテゴリー: {item.category}</p>
            <p className="mb-4">{item.description}</p>

            <div className="d-flex align-items-center mb-3">
              <label className="me-2 fw-semibold">数量:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: "80px" }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <h4 className="text-primary fw-bold mb-3">
              {item.price.toLocaleString()} 円
            </h4>

            <div className="d-flex gap-3">
              <Button variant="primary" onClick={addToCart}>
                カートに追加
              </Button>
              <Button variant="success">購買</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import axiosInstance from "../component/axiosInstance";
import { Link } from "react-router-dom";

const categories = [
  "전체 보기",
  "CPU",
  "GPU",
  "RAM",
  "Motherboard",
  "Storage",
  "Power Supply",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");

  useEffect(() => {
    axiosInstance.get("/items").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts =
    selectedCategory === "전체 보기"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Container className="py-4">
        <h1 className="mb-4 text-center">컴퓨터 부품 샵</h1>

        <Row className="mb-4 justify-content-center">
          {categories.map((category, idx) => (
            <Col xs="auto" key={idx}>
              <Button
                size="sm"
                variant={
                  selectedCategory === category
                    ? "primary"
                    : "outline-secondary"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            </Col>
          ))}
        </Row>

        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Link
                    to={`/items/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card.Img
                      variant="top"
                      src={product.imagePaths?.[0] || "/default.jpg"}
                      style={{ objectFit: "contain", height: "200px" }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="fs-6 text-dark">
                        {product.itemname}
                      </Card.Title>
                      <Card.Text className="fw-bold text-primary">
                        {product.price}원
                      </Card.Text>
                    </Card.Body>
                  </Link>
                  <Card.Footer className="bg-white border-0 text-center">
                    <Button size="sm" variant="outline-primary">
                      장바구니 담기
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted text-center">
              해당 카테고리에 상품이 없습니다.
            </p>
          )}
        </Row>
      </Container>
    </>
  );
}

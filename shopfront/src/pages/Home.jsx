import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import axiosInstance from "../component/axiosInstance";
import { Link } from "react-router-dom";

const categories = [
  "Total",
  "CPU",
  "GPU",
  "RAM",
  "Motherboard",
  "Storage",
  "Power Supply",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Total");

  useEffect(() => {
    axiosInstance.get("/items").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts =
    selectedCategory === "Total"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center text-primary fw-bold">
        パソコン・パーツストア
      </h1>

      <Row className="mb-4 justify-content-center">
        {categories.map((category, idx) => (
          <Col xs="auto" key={idx}>
            <Button
              size="sm"
              variant={
                selectedCategory === category ? "primary" : "outline-secondary"
              }
              className="rounded-pill px-3"
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
              <Card className="h-100 shadow-sm border-0 hover-shadow transition">
                <Link
                  to={`/items/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      product.imagePaths?.find((path) => !!path) ||
                      "/images/default.png"
                    }
                    style={{
                      objectFit: "contain",
                      height: "200px",
                      backgroundColor: "#f8f9fa",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default.png";
                    }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="fs-6 text-dark mb-2">
                      {product.itemname}
                    </Card.Title>
                    <Card.Text className="fw-bold text-danger fs-5">
                      {product.price.toLocaleString()}円
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted text-center">
            該当するカテゴリーに商品が存在しません
          </p>
        )}
      </Row>
    </Container>
  );
}

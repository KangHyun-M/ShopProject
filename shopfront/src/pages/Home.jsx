import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const categories = [
  "CPU",
  "GPU",
  "RAM",
  "Motherboard",
  "Storage",
  "Power Supply",
];

const products = [
  { name: "Intel Core i9", price: "$500", category: "CPU" },
  { name: "NVIDIA RTX 3080", price: "$700", category: "GPU" },
  { name: "Corsair Vengeance 16GB", price: "$80", category: "RAM" },
  // 추가 상품 목록을 여기에 작성
];

export default function Home() {
  return (
    <Container>
      <h1 className="my-4 text-center">컴퓨터 부품 쇼핑몰</h1>

      <h2>카테고리</h2>
      <Row className="mb-4">
        {categories.map((category, index) => (
          <Col key={index} sm={6} md={4} lg={2}>
            <div className="category-card p-3 text-center border rounded">
              {category}
            </div>
          </Col>
        ))}
      </Row>

      <h2>상품</h2>
      <Row>
        {products.map((product, index) => (
          <Col key={index} sm={6} md={4} lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.price}</Card.Text>
                <Button variant="primary">장바구니에 담기</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

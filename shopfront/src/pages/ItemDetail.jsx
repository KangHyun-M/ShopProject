import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import { Container, Card, Carousel, Image, Spinner } from "react-bootstrap";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) =>
        console.error("상품 정보를 불러오는 중 에러가 발생했습니다", err)
      );
  }, [id]);

  if (!item)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">상품 정보를 불러오는 중입니다...</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      {/* 이미지 영역 */}
      {item.imagePaths && item.imagePaths.length > 0 ? (
        <Carousel variant="dark" interval={null} className="mb-4">
          {item.imagePaths.map((path, idx) => (
            <Carousel.Item key={idx}>
              <Image
                src={path}
                alt={`상품 이미지 ${idx + 1}`}
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
          src="/default.jpg"
          alt="기본 이미지"
          fluid
          style={{
            height: "400px",
            objectFit: "contain",
            marginBottom: "20px",
          }}
        />
      )}

      {/* 상품 정보 */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Card.Title className="fs-4 fw-bold">{item.itemname}</Card.Title>
          <Card.Text className="text-muted">
            카테고리: {item.category}
          </Card.Text>
          <Card.Text className="mt-3">{item.description}</Card.Text>
          <Card.Text className="fs-5 fw-bold text-primary">
            {item.price.toLocaleString()} 원
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

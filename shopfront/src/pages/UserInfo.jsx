import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";

export default function UserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("유저 정보 로딩 실패", err);
        alert("관리자 또는 사용자만 접근 가능합니다");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="p-4 shadow-sm">
        <Card.Title className="mb-4">내 정보</Card.Title>

        <Row className="mb-2">
          <Col sm={3}>
            <strong>아이디:</strong>
          </Col>
          <Col>{user.username}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3}>
            <strong>닉네임:</strong>
          </Col>
          <Col>{user.usernic}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3}>
            <strong>권한:</strong>
          </Col>
          <Col>{user.role}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3}>
            <strong>주소:</strong>
          </Col>
          <Col>{user.address || "등록된 주소 없음"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3}>
            <strong>우편번호:</strong>
          </Col>
          <Col>{user.zipcode || "-"}</Col>
        </Row>
      </Card>
    </Container>
  );
}

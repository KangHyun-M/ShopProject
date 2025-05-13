import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import UserInfoSidebar from "../component/UserInfoSidebar";

export default function AddressList() {
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 로그인 및 권한 확인 + 주소 목록 조회
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        const role = res.data.role;
        if (role !== "USER" && role !== "ADMIN") {
          alert("관리자 및 유저만 접근 가능합니다");
          navigate("/");
        } else {
          fetchAddressList();
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다");
        navigate("/login");
      });
  }, [navigate]);

  const fetchAddressList = () => {
    axiosInstance
      .get("/user/address")
      .then((res) => setAddressList(res.data))
      .catch((err) => {
        console.error("주소 불러오기 실패", err);
        alert("주소 정보를 불러올 수 없습니다");
      })
      .finally(() => setLoading(false));
  };

  // 삭제 처리
  const handleDelete = async (id) => {
    if (!window.confirm("이 주소를 정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/user/address/${id}`);
      alert("주소가 삭제되었습니다");
      setAddressList((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("주소 삭제 실패", err);
      alert("삭제에 실패했습니다");
    }
  };

  // 대표 주소 설정
  const handleSetMain = async (id) => {
    try {
      await axiosInstance.patch(`/user/address/${id}/main`);
      alert("대표 주소가 설정되었습니다");
      fetchAddressList();
    } catch (err) {
      console.error("대표 주소 설정 실패", err);
      alert("대표 주소 설정에 실패했습니다");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <UserInfoSidebar />
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>등록된 주소</h4>
            <Button onClick={() => navigate("/mypage/newaddress")}>
              새 주소 추가
            </Button>
          </div>

          <Row>
            {addressList.length === 0 ? (
              <p>등록된 주소가 없습니다.</p>
            ) : (
              addressList.map((addr) => (
                <Col md={6} lg={4} key={addr.id} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <Card.Subtitle className="text-muted mb-1">
                        우편번호
                      </Card.Subtitle>
                      <Card.Text>{addr.zipcode}</Card.Text>

                      <Card.Subtitle className="text-muted mb-1">
                        주소
                      </Card.Subtitle>
                      <Card.Text>{addr.address}</Card.Text>

                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/mypage/address/${addr.id}`)}
                        >
                          상세보기
                        </Button>

                        <Button
                          variant="outline-success"
                          size="sm"
                          disabled={addr.isMain}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetMain(addr.id);
                          }}
                        >
                          {addr.isMain ? "대표 주소" : "대표로 설정"}
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(addr.id);
                          }}
                        >
                          삭제
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

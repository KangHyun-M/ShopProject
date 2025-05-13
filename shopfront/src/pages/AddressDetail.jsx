import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import UserInfoSidebar from "../component/UserInfoSidebar";
import AddressModal from "./AddressModal";

export default function AddressDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState(""); // 都道府県
  const [address2, setAddress2] = useState(""); // 市区町村
  const [address3, setAddress3] = useState(""); // 町名
  const [banji, setBanji] = useState(""); // 番地
  const [detail, setDetail] = useState(""); // 건물명 등
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/user/address/${id}`)
      .then((res) => {
        const fullAddress = res.data.address;
        setZipcode(res.data.zipcode);

        // 주소 파싱 (예: 北海道札幌市中央区5丁目7番地○○ビル101号室)
        const parsed1 = fullAddress.slice(0, 3);
        const parsed2 = fullAddress.slice(3, 6);
        const rest = fullAddress.slice(6);
        const match = rest.match(/^(.*?番地)(.*)$/);

        setAddress1(parsed1);
        setAddress2(parsed2);
        if (match) {
          setAddress3(match[1].replace("番地", ""));
          setBanji("番地");
          setDetail(match[2]);
        } else {
          setAddress3(rest);
          setBanji("");
          setDetail("");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("주소 정보 불러오기 실패", err);
        alert("주소 정보를 불러올 수 없습니다");
        navigate("/mypage/addresslist");
      });
  }, [id, navigate]);

  const handleUpdate = async () => {
    const fullAddress = address1 + address2 + address3 + banji + detail;
    try {
      await axiosInstance.patch(`/user/address/${id}`, {
        zipcode,
        address: fullAddress,
      });
      alert("주소가 수정되었습니다");
      navigate("/mypage/addresslist");
    } catch (err) {
      console.error("주소 수정 실패", err);
      alert("수정에 실패했습니다");
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
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <Row>
        <Col md={3}>
          <UserInfoSidebar />
        </Col>
        <Col md={9}>
          <h3 className="mb-4">주소 수정</h3>

          <Form.Group className="mb-3">
            <Form.Label>郵便番号</Form.Label>
            <Row>
              <Col xs={8}>
                <Form.Control
                  type="text"
                  placeholder="例: 0600062"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </Col>
              <Col>
                <Button onClick={() => setShowModal(true)}>住所検索</Button>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>都道府県</Form.Label>
            <Form.Control type="text" value={address1} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>市区町村</Form.Label>
            <Form.Control type="text" value={address2} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>町名・番地</Form.Label>
            <Row>
              <Col sm={6}>
                <Form.Control type="text" value={address3} readOnly />
              </Col>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="番地を入力"
                  value={banji}
                  onChange={(e) => setBanji(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>建物名・部屋番号など</Form.Label>
            <Form.Control
              type="text"
              placeholder="例: ○○ビル101号室"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleUpdate}>
            保存
          </Button>

          <AddressModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSelect={(result) => {
              setZipcode(result.zipcode);
              setAddress1(result.address1);
              setAddress2(result.address2);
              setAddress3(result.address3);
              setShowModal(false);
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import AddressModal from "./AddressModal"; // 👈 モーダルコンポーネント

export default function Address() {
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState(""); // 都道府県
  const [address2, setAddress2] = useState(""); // 市区町村
  const [address3, setAddress3] = useState(""); // 町名
  const [banji, setBanji] = useState(""); // 番地
  const [detail, setDetail] = useState(""); // 建物名など
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ログインと権限チェック
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        const role = res.data.role;
        if (role !== "USER" && role !== "ADMIN") {
          Swal.fire(
            "アクセス拒否",
            "管理者およびユーザーのみアクセス可能です",
            "warning"
          );
          navigate("/");
        }
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("ログインエラー", "ログインしてください", "error");
        navigate("/login");
      });
  }, [navigate]);

  // 住所保存処理
  const handleSave = async () => {
    const fullAddress = address1 + address2 + address3 + banji + detail;
    try {
      await axiosInstance.post("/user/address", {
        zipcode,
        address: fullAddress,
      });
      Swal.fire("成功", "住所が保存されました", "success");
      navigate("/mypage/addresslist");
    } catch (err) {
      console.error("住所の保存に失敗:", err);
      Swal.fire("エラー", "住所の保存に失敗しました", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">住所の入力</h3>

      {/* 郵便番号 */}
      <Form.Group className="mb-3">
        <Form.Label>郵便番号</Form.Label>
        <Row>
          <Col xs={8}>
            <Form.Control
              type="text"
              placeholder="例：0600062"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </Col>
          <Col>
            <Button onClick={() => setShowModal(true)}>住所検索</Button>
          </Col>
        </Row>
      </Form.Group>

      {/* 都道府県 */}
      <Form.Group className="mb-3">
        <Form.Label>都道府県</Form.Label>
        <Form.Control type="text" value={address1} readOnly />
      </Form.Group>

      {/* 市区町村 */}
      <Form.Group className="mb-3">
        <Form.Label>市区町村</Form.Label>
        <Form.Control type="text" value={address2} readOnly />
      </Form.Group>

      {/* 町名 + 番地 */}
      <Form.Group className="mb-3">
        <Form.Label>町名・番地</Form.Label>
        <Row>
          <Col sm={6}>
            <Form.Control type="text" value={address3} readOnly />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="番地を入力（例：5丁目7番地）"
              value={banji}
              onChange={(e) => setBanji(e.target.value)}
            />
          </Col>
        </Row>
      </Form.Group>

      {/* 建物名など */}
      <Form.Group className="mb-4">
        <Form.Label>建物名・部屋番号など</Form.Label>
        <Form.Control
          type="text"
          placeholder="例：○○ビル101号室"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </Form.Group>

      <div className="text-end">
        <Button variant="primary" onClick={handleSave}>
          保存する
        </Button>
      </div>

      {/* 住所検索モーダル */}
      <AddressModal
        show={showModal}
        initialZipcode={zipcode}
        onClose={() => setShowModal(false)}
        onSelect={(result) => {
          setZipcode(result.zipcode);
          setAddress1(result.address1);
          setAddress2(result.address2);
          setAddress3(result.address3);
          setShowModal(false);
        }}
      />
    </Container>
  );
}

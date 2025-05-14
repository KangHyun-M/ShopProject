import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../component/axiosInstance";
import AddressModal from "./AddressModal";

export default function AddressDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [banji, setBanji] = useState("");
  const [detail, setDetail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/user/address/${id}`)
      .then((res) => {
        const fullAddress = res.data.address;
        setZipcode(res.data.zipcode);

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
        console.error("住所情報取得失敗", err);
        Swal.fire("エラー", "住所情報を取得できません", "error");
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
      Swal.fire("成功", "住所が更新されました", "success");
      navigate("/mypage/addresslist");
    } catch (err) {
      console.error("住所更新失敗", err);
      Swal.fire("エラー", "住所の更新に失敗しました", "error");
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
    <Container fluid className="py-4">
      <Row>
        <Col md={9}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4">住所修正</h4>

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

            <div className="text-end">
              <Button variant="primary" onClick={handleUpdate}>
                保存
              </Button>
            </div>
          </Card>

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
            initialZipcode={zipcode}
          />
        </Col>
      </Row>
    </Container>
  );
}

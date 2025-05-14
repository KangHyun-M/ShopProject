// src/pages/OrderPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../component/axiosInstance";
import AddressModal from "./AddressModal";

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCartItems = useMemo(
    () => location.state?.cartItemIds || [],
    [location.state]
  );

  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newZipcode, setNewZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [banji, setBanji] = useState("");
  const [detail, setDetail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    axiosInstance.get("/user/address").then((res) => {
      setAddressList(res.data);
      const main = res.data.find((addr) => addr.isMain);
      if (main) setSelectedAddress(main);
    });

    if (selectedCartItems.length > 0) {
      axiosInstance
        .get("/user/cart/sum", {
          params: { ids: selectedCartItems.join(",") },
        })
        .then((res) => setCartDetails(res.data))
        .catch((err) => console.error("注文内容取得失敗", err));
    }
  }, [selectedCartItems]);

  const handleSubmit = async () => {
    const fullAddress = address1 + address2 + address3 + banji + detail;
    const data = {
      cartItemIds: selectedCartItems,
      zipcode: newZipcode || selectedAddress?.zipcode,
      address: fullAddress || selectedAddress?.address,
    };

    if (!data.zipcode || !data.address) {
      Swal.fire("エラー", "住所を選択または入力してください", "warning");
      return;
    }

    try {
      await axiosInstance.post("/user/orders", data);
      Swal.fire("成功", "注文が完了しました", "success").then(() => {
        navigate("/mypage/orders");
      });
    } catch (err) {
      Swal.fire("失敗", "注文に失敗しました", "error");
      console.error(err);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">📦 注文ページ</h3>

      <Card className="p-3 shadow-sm mb-4">
        <h5 className="mb-3">🛍 注文商品</h5>
        {cartDetails.map((item) => (
          <div key={item.cartItemId} className="d-flex mb-3">
            <img
              src={item.imgUrl || "/images/default.png"}
              alt={item.itemName}
              style={{ width: "80px", height: "80px", objectFit: "contain" }}
              className="me-3"
            />
            <div className="flex-grow-1">
              <p className="mb-1 fw-bold">{item.itemName}</p>
              <p className="d-flex justify-content-between mb-0">
                <span>{item.quantity}個</span>
                <span>{(item.quantity * item.price).toLocaleString()}円</span>
              </p>
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-3 shadow-sm mb-4">
        <h5 className="mb-3">🏠 配送先選択</h5>
        <Form>
          {addressList.map((addr) => (
            <Form.Check
              key={addr.id}
              type="radio"
              name="address"
              id={`addr-${addr.id}`}
              label={`[${addr.zipcode}] ${addr.address} ${
                addr.isMain ? "(代表住所)" : ""
              }`}
              checked={selectedAddress?.id === addr.id}
              onChange={() => setSelectedAddress(addr)}
              className="mb-2"
            />
          ))}
        </Form>
      </Card>

      <Card className="p-3 shadow-sm mb-4">
        <h5 className="mb-3">🆕 新しい住所</h5>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="郵便番号"
            value={newZipcode}
            onChange={(e) => setNewZipcode(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(true)}
          >
            住所検索
          </Button>
        </InputGroup>
        <Form.Group className="mb-2">
          <Form.Label>都道府県</Form.Label>
          <Form.Control type="text" value={address1} readOnly />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>市区町村</Form.Label>
          <Form.Control type="text" value={address2} readOnly />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>町名・番地</Form.Label>
          <Form.Control
            type="text"
            value={address3 + banji}
            onChange={(e) => setBanji(e.target.value)}
            placeholder="番地を入力 (例: 5丁目7番地)"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>建物名・部屋番号など</Form.Label>
          <Form.Control
            type="text"
            placeholder="例: ○○ビル101号室"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </Form.Group>
      </Card>

      <div className="text-end">
        <Button variant="success" onClick={handleSubmit}>
          注文する
        </Button>
      </div>

      <AddressModal
        show={showModal}
        initialZipcode={newZipcode}
        onClose={() => setShowModal(false)}
        onSelect={(result) => {
          setNewZipcode(result.zipcode);
          setAddress1(result.address1);
          setAddress2(result.address2);
          setAddress3(result.address3);
          setShowModal(false);
        }}
      />
    </Container>
  );
}

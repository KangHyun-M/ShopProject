import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 유저 확인 + 장바구니 불러오기
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then(() => fetchCartItems())
      .catch(() => {
        alert("ログインしてください");
        navigate("/login");
      });
  }, [navigate]);

  // 장바구니 불러오기 함수
  const fetchCartItems = () => {
    axiosInstance
      .get("/user/cart")
      .then((res) => {
        const validItems = res.data.filter((item) => item.itemId != null);
        setCartItems(validItems);
      })
      .catch((err) => {
        console.error("カートの読み込みに失敗しました", err);
      });
  };

  // 상세 페이지 이동
  const goToDetail = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // 장바구니 아이템 삭제
  const deleteItem = (cartItemId) => {
    axiosInstance
      .delete(`/user/cart/${cartItemId}`)
      .then(() => {
        setCartItems((prev) =>
          prev.filter((item) => item.cartItemId !== cartItemId)
        );
      })
      .catch((err) => {
        console.error("削除失敗", err);
      });
  };

  // 수량 변경
  const updateQuantity = (cartItemId, newQty) => {
    axiosInstance
      .patch(`/user/cart/${cartItemId}?quantity=${newQty}`)
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQty }
              : item
          )
        );
      })
      .catch((err) => {
        alert("数量変更失敗");
        console.error(err);
      });
  };

  // 총 가격 계산
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 주문 처리
  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert("注文する商品がありません");
      return;
    }

    const cartItemIds = cartItems.map((item) => item.cartItemId);
    navigate("/mypage/orderpage", { state: { cartItemIds } }); // 주문 페이지로 이동하며 데이터 전달
  };

  return (
    <Container className="mt-4">
      <h3>🛒 カート</h3>
      <Row>
        {cartItems.length === 0 && <p>カートが空いてます</p>}
        {cartItems.map((item) => (
          <Col md={4} key={item.cartItemId} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={item.imgUrl || "/images/default.png"}
                alt={item.itemName}
                onClick={() => goToDetail(item.itemId)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default.png";
                }}
                style={{
                  height: "150px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
              />
              <Card.Body>
                <Card.Title>{item.itemName}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>価格: {item.price.toLocaleString()}円</Card.Text>
                <Card.Text>
                  数量:{" "}
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.cartItemId, Number(e.target.value))
                    }
                    style={{ width: "60px", marginLeft: "5px" }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => deleteItem(item.cartItemId)}
                >
                  削除
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 총 가격 + 주문 버튼 */}
      <div className="text-end mt-3">
        <h5>
          Total:{" "}
          <span className="text-primary">{totalPrice.toLocaleString()} 円</span>
        </h5>
        <Button variant="success" className="mt-2" onClick={handleOrder}>
          注文する
        </Button>
      </div>

      {/* 주문 완료 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 注文完了</Modal.Title>
        </Modal.Header>
        <Modal.Body>ご注文ありがとうございます！</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => navigate("/mypage/orderpage")}
          >
            注文履歴へ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

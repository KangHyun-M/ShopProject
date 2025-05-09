import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  //로그인 유저 확인 및 장바구니 불러오기   ユーザー確認及びカート取得
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then(() => {
        // 로그인된 경우 장바구니 불러오기  ログインしているユーザーの場合、カートを取得
        axiosInstance
          .get("/user/cart")
          .then((res) => setCartItems(res.data))
          .catch((err) => {
            console.error("カートの読み込みに失敗しました", err);
          });
      })
      .catch(() => {
        alert("ログインしてください");
        navigate("/login");
      });
  }, [navigate]);

  //  상품 상세 페이지 이동 商品の詳細ページに遷移
  const goToDetail = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  //  장바구니 아이템 삭제  カートから商品を削除
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

  //Change Amount of Item   商品の数量変更
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

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
      <div className="text-end mt-3">
        <h5>
          Total:{" "}
          <span className="text-primary">{totalPrice.toLocaleString()} 円</span>
        </h5>
      </div>
    </Container>
  );
}

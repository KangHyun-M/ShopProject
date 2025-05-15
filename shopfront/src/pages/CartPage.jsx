import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ログイン確認 → カート取得
    axiosInstance
      .get("/me")
      .then(() => fetchCartItems())
      .catch(() => {
        Swal.fire("ログインエラー", "ログインしてください", "error");
        navigate("/login");
      });
  }, [navigate]);

  // カートアイテム取得（削除済み商品は除外）
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

  // 商品詳細ページへ移動
  const goToDetail = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // カートから商品削除
  const deleteItem = (cartItemId) => {
    Swal.fire({
      title: "削除確認",
      text: "この商品をカートから削除しますか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "削除",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/user/cart/${cartItemId}`)
          .then(() => {
            setCartItems((prev) =>
              prev.filter((item) => item.cartItemId !== cartItemId)
            );
            Swal.fire("削除完了", "商品が削除されました", "success");
          })
          .catch((err) => {
            console.error("削除失敗", err);
            Swal.fire("エラー", "削除に失敗しました", "error");
          });
      }
    });
  };

  // 数量変更
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
        Swal.fire("エラー", "数量の変更に失敗しました", "error");
        console.error(err);
      });
  };

  // 合計金額計算
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 注文ページへ遷移
  const handleOrder = () => {
    if (cartItems.length === 0) {
      Swal.fire("注文不可", "注文する商品がありません", "info");
      return;
    }

    const cartItemIds = cartItems.map((item) => item.cartItemId);
    navigate("/mypage/orderpage", { state: { cartItemIds } });
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">🛒 カート</h3>

      <Row>
        {/* カートが空のとき */}
        {cartItems.length === 0 && (
          <p className="text-muted">カートに商品がありません。</p>
        )}

        {/* カート商品一覧 */}
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
                <Card.Text className="fw-bold text-primary">
                  価格：{item.price.toLocaleString()}円
                </Card.Text>
                <Card.Text>
                  数量：
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
                <div className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteItem(item.cartItemId)}
                  >
                    削除
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 合計金額・注文ボタン */}
      <div className="text-end mt-4">
        <h5>
          合計：
          <span className="text-success fw-bold">
            {totalPrice.toLocaleString()} 円
          </span>
        </h5>
        <Button variant="success" className="mt-2 px-4" onClick={handleOrder}>
          注文する
        </Button>
      </div>

      {/* 注文完了モーダル（※注文API処理とは未連携） */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 注文完了</Modal.Title>
        </Modal.Header>
        <Modal.Body>ご注文ありがとうございます！</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/mypage/orders")}>
            注文履歴へ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

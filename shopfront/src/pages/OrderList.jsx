import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../component/axiosInstance";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 注文履歴を取得
  useEffect(() => {
    axiosInstance
      .get("/user/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("注文履歴取得失敗", err);
        Swal.fire("エラー", "注文履歴の取得に失敗しました", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  // 商品詳細ページへ移動
  const goToDetail = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // ローディング中のスピナー
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">読み込み中です...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold">📦 注文履歴</h3>

      {/* 注文がない場合 */}
      {orders.length === 0 ? (
        <p className="text-muted">注文履歴がありません。</p>
      ) : (
        // 注文ごとのカード表示
        orders.map((order) => (
          <Card key={order.orderId} className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
              <strong>注文日：</strong>{" "}
              {new Date(order.orderAt).toLocaleString()}
              <Badge bg="secondary" className="ms-2">
                {order.items.length} 件
              </Badge>
              <div className="text-muted mt-1 small">
                <i className="bi bi-geo-alt"></i> 配送先：[{order.deliveryZip}]{" "}
                {order.deliveryAddr}
              </div>
            </Card.Header>

            <Card.Body>
              <Row>
                {/* 注文内の商品一覧 */}
                {order.items.map((item, idx) => (
                  <Col
                    key={idx}
                    md={6}
                    className="d-flex align-items-start mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => goToDetail(item.itemId)}
                  >
                    <img
                      src={item.imgPath || "/images/default.png"}
                      alt={item.itemName}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                      }}
                      className="me-3 rounded border"
                    />
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-bold">{item.itemName}</p>
                      <div className="d-flex justify-content-between small">
                        <span>{item.quantity} 個</span>
                        <span>
                          {(item.quantity * item.price).toLocaleString()} 円
                        </span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

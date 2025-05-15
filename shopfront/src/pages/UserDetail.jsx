import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ユーザー情報取得
  useEffect(() => {
    axiosInstance
      .get(`/admin/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("ユーザー詳細取得失敗", err);
        Swal.fire("エラー", "ユーザー情報の取得に失敗しました", "error");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 注文キャンセル処理
  const cancelOrder = (orderId) => {
    Swal.fire({
      title: "注文をキャンセルしますか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "はい、キャンセルします",
      cancelButtonText: "いいえ",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/admin/orders/${orderId}`)
          .then(() => {
            Swal.fire(
              "キャンセル完了",
              "注文がキャンセルされました",
              "success"
            );
            setUser((prev) => ({
              ...prev,
              orders: prev.orders.filter((o) => o.orderId !== orderId),
            }));
          })
          .catch(() => {
            Swal.fire("失敗", "注文キャンセルに失敗しました", "error");
          });
      }
    });
  };

  // ローディング表示
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">読み込み中です...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-4">👤 ユーザー詳細</h3>

      {/* ユーザー情報カード */}
      <Card className="mb-4 p-3">
        <p>
          <strong>ID：</strong> {user.username}
        </p>
        <p>
          <strong>ニックネーム：</strong> {user.usernic}
        </p>
      </Card>

      {/* 注文履歴セクション */}
      <h5 className="mb-3">📦 注文履歴</h5>

      {user.orders.length === 0 ? (
        <p className="text-muted">注文履歴がありません。</p>
      ) : (
        user.orders.map((order) => (
          <Card key={order.orderId} className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
              <strong>注文日：</strong>{" "}
              {new Date(order.orderAt).toLocaleString()}{" "}
              <Badge bg="secondary" className="ms-2">
                {order.items.length} 件
              </Badge>
              <div className="text-muted mt-1 small">
                配送先：[{order.deliveryZip}] {order.deliveryAddr}
              </div>
            </Card.Header>

            <Card.Body>
              <Row>
                {/* 商品リスト */}
                {order.items.map((item, idx) => (
                  <Col
                    key={idx}
                    md={6}
                    className="d-flex align-items-start mb-3"
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

              {/* 注文キャンセルボタン */}
              <div className="text-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => cancelOrder(order.orderId)}
                >
                  注文キャンセル
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

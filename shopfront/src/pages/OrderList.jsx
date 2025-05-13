import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { Container, Card } from "react-bootstrap";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/user/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("注文履歴取得失敗", err));
  }, []);

  return (
    <Container className="mt-4">
      <h3>📦 注文履歴</h3>
      {orders.length === 0 ? (
        <p>注文履歴がありません</p>
      ) : (
        orders.map((order) => (
          <Card key={order.orderId} className="mb-3 shadow-sm">
            <Card.Body>
              <h5>注文日: {new Date(order.orderAt).toLocaleString()}</h5>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.itemName} - {item.quantity}個 -{" "}
                    {item.price.toLocaleString()}円
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

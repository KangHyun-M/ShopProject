// src/pages/ItemListPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../component/axiosInstance";

export default function ItemListPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("/list/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("상품 불러오기 실패", err));
  }, []);

  return (
    <div>
      <h2>상품 목록</h2>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <h3>{item.itemname}</h3>
            <p>{item.description}</p>
            <p>{item.price}원</p>
            <p>카테고리: {item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

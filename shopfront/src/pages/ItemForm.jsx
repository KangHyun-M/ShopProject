// src/pages/AdminCreateItemPage.jsx
import React, { useState } from "react";
import axios from "../component/axiosInstance";

export default function AdminCreateItemPage() {
  const [form, setForm] = useState({
    itemname: "",
    description: "",
    price: 0,
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/admin/post-item", form)
      .then(() => alert("상품 등록 성공"))
      .catch((err) => alert("등록 실패"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>상품 등록</h2>
      <input name="itemname" placeholder="이름" onChange={handleChange} />
      <input name="description" placeholder="설명" onChange={handleChange} />
      <input
        name="price"
        type="number"
        placeholder="가격"
        onChange={handleChange}
      />
      <input name="category" placeholder="카테고리" onChange={handleChange} />
      <button type="submit">등록</button>
    </form>
  );
}

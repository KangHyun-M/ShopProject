// src/pages/AdminPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/user/me")
      .then((res) => {
        if (res.data.role !== "ROLE_ADMIN") {
          alert("관리자만 접근 가능합니다.");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("로그인이 필요합니다.");
        navigate("/login");
      });
  }, [navigate]);

  const goToProductForm = () => {
    navigate("/admin/item-form");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>관리자 페이지</h2>
      <p>관리자만 접근 가능합니다.</p>
      <button onClick={goToProductForm}>상품 작성 페이지로 이동</button>
    </div>
  );
}

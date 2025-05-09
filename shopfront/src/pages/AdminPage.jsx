// src/pages/AdminPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          alert("管理者しかアクセスできません");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("ログインしてください");
        navigate("/login");
      });
  }, [navigate]);

  const goToProductForm = () => {
    navigate("/itemregistration");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>管理者ページ</h2>
      <p>管理者しかアクセスできません</p>
      <button onClick={goToProductForm}>商品登録ページに遷移</button>
    </div>
  );
}

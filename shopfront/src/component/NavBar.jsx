// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext"; // 로그인 상태 전역 관리

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // authContext에 정의된 logout 호출
    navigate("/"); // 홈으로 이동
  };

  return (
    <nav style={{ padding: "10px", backgroundColor: "#eee" }}>
      <ul style={{ display: "flex", gap: "15px", listStyle: "none" }}>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/cart">장바구니</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout}>로그아웃</button>
          </li>
        ) : (
          <li>
            <Link to="/login">로그인</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

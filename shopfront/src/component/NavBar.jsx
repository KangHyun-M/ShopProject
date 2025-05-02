import React from "react";
import { Link } from "react-router-dom"; // useNavigate 제거
import { useAuth } from "./authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
        {user ? (
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>
              {user.username} ({user.role})
            </span>
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

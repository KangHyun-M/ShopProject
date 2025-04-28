import React, { useState } from "react";

import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../component/authContext"; //로그인 상태 관리 hook 가져오기
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옴

export default function Login() {
  const { login } = useAuth(); // 로그인 상태 변경 함수
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate 훅으로 페이지 이동을 위한 함수

  const handleLogin = async (e) => {
    e.preventDefault(); // form submit 시 페이지 리로드 방지

    try {
      const res = await axiosInstance.post("/login", { username, password });
      if (res.data === "로그인 성공") {
        login(); // 로그인 성공 시 상태 변경
        alert("로그인 성공!");
        // 로그인 성공 후 원하는 페이지로 이동 (예: Home 페이지)
        navigate("/"); // Home 페이지로 이동
      } else {
        alert("아이디나 비밀번호가 맞지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 실패: ", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h3 style={{ textAlign: "center" }}>로그인</h3>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}

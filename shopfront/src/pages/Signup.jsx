import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";

export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  //입력값 처리리
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };
  //회원가입 폼 제출출
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/signup", user);
      alert("회원가입 완료");
      window.location.href = "/";
    } catch (error) {
      console.log(
        "회원가입 에러: " + error.response ? error.response.data : error.message
      );
    }
  };
  return (
    <div>
      <h3>회원가입</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          value={user.username}
          placeholder="이름"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          value={user.password}
          placeholder="비밀번호"
          onChange={handleChange}
        />
        <input type="hidden" id="role" value="USER" />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

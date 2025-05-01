import axiosInstance from "./axiosInstance";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const login = () => {
    localStorage.setItem("token", "your_token"); // 필요 시 서버 응답 토큰 사용
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout"); // Spring Security logout 처리
    } catch (err) {
      console.error("서버 로그아웃 실패", err);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

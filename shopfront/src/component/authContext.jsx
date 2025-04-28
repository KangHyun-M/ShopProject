import React, { createContext, useContext, useState } from "react";

//로그인 상태를 관리할 context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); //다른곳에서 로그인 상태를 사용하기
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true); //로그인
  const logout = () => setIsLoggedIn(false); //로그아웃

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

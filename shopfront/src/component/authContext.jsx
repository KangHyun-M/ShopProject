import axiosInstance from "./axiosInstance";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/me");
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("ユーザー情報の取得失敗", err);
      setUser(null);
    }
  }, []);

  const login = async (username, password, from = "/") => {
    try {
      const res = await axiosInstance.post("/login", { username, password });
      if (res.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", "true");
        await fetchUser();
        alert("ログイン成功!");
        navigate(from, { replace: true });
      } else {
        alert("ログイン失敗!");
      }
    } catch (err) {
      console.error("ログイン要求失敗", err);
      alert("ログイン失敗!");
    }
  };

  const logout = async () => {
    try {
      const res = await axiosInstance.post("/logout");
      if (res.status === 200 || res.status === 204) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        alert("ログアウトしました");
        navigate("/");
      } else {
        alert("ログアウト失敗");
      }
    } catch (err) {
      console.error("ログアウト要求失敗", err);
      alert("ログアウト失敗");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axiosInstance.get("/me");
        if (res.data) {
          setIsLoggedIn(true);
          setUser(res.data);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        console.error("セッション確認失敗", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  //중복 방지를 위한 user === null 조건 추가
  useEffect(() => {
    if (isLoggedIn && user === null) {
      fetchUser();
    }
  }, [isLoggedIn, user, fetchUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

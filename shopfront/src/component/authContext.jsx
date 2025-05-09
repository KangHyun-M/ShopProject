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
    if (!isLoggedIn) return;
    try {
      const res = await axiosInstance.get("/me");
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        console.warn("ユーザー情報を取得できません");
      }
    } catch (err) {
      console.error("ユーザー情報の取得失敗", err);
      setUser(null);
      console.warn(
        "ログイン状態を確認できません。もう一度ログインしてください。"
      );
    }
  }, [isLoggedIn]);

  const login = async (username, password, from = "/") => {
    try {
      const res = await axiosInstance.post("/login", { username, password });
      console.log("authContext ログインリクエストのレスポンス :", res);
      if (res.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", "true");
        await fetchUser();
        alert("ログイン成功!");
        console.log("ログイン試行 - メールアドレス:", username);

        // 이전 페이지로 이동 以前のページに遷移
        navigate(from, { replace: true });
      } else {
        alert("ログイン失敗!");
        console.error("ログイン失敗 - サーバー応答:", res);
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
        console.error("ログアウト失敗 - サーバーエラー", res);
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
        console.warn("ログイン状態を確認できません");
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [isLoggedIn, fetchUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

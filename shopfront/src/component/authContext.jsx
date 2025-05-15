import axiosInstance from "./axiosInstance";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert2 사용

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態
  const [user, setUser] = useState(null); // ユーザー情報
  const navigate = useNavigate();

  // ユーザー情報取得
  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/me");
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("ユーザー情報の取得に失敗しました", err);
      setUser(null);
    }
  }, []);

  // ログイン処理
  const login = async (username, password, from = "/") => {
    try {
      const res = await axiosInstance.post("/login", { username, password });
      if (res.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", "true"); // 仮のトークン保存（セッション維持の目的）
        await fetchUser();
        await Swal.fire({
          icon: "success",
          title: "ログインに成功しました",
          confirmButtonText: "OK",
        });
        navigate(from, { replace: true });
      } else {
        await Swal.fire({
          icon: "error",
          title: "ログインに失敗しました",
        });
      }
    } catch (err) {
      console.error("ログインリクエスト失敗", err);
      await Swal.fire({
        icon: "error",
        title: "ログインに失敗しました",
      });
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      const res = await axiosInstance.post("/logout");
      if (res.status === 200 || res.status === 204) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        await Swal.fire({
          icon: "info",
          title: "ログアウトしました",
        });
        navigate("/");
      } else {
        await Swal.fire({
          icon: "error",
          title: "ログアウトに失敗しました",
        });
      }
    } catch (err) {
      console.error("ログアウトリクエスト失敗", err);
      await Swal.fire({
        icon: "error",
        title: "ログアウトに失敗しました",
      });
    }
  };

  // 初回マウント時にセッション確認
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

  // ログイン状態だが user が null の場合、再取得（多重フェッチ防止）
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

// 認証状態を利用するためのフック
export const useAuth = () => useContext(AuthContext);

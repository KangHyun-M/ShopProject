// authContext.jsx
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
        console.warn("유저 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
      setUser(null);
      console.warn("로그인 상태를 확인할 수 없습니다. 다시 로그인 해주세요.");
    }
  }, [isLoggedIn]);

  const login = async (username, password) => {
    // ✅ username과 password 파라미터 추가
    try {
      const res = await axiosInstance.post("/login", { username, password });
      console.log("authContext 로그인 요청 응답:", res);
      if (res.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", "true"); // 로컬 스토리지에 토큰 저장
        await fetchUser(); // 유저 정보 바로 가져오기
        alert("로그인 성공!"); // 로그인 성공 메시지 표시
        navigate("/"); // 로그인 후 메인페이지로 리디렉션
        console.log("로그인 시도 - 아이디:", username, "비밀번호:", password); // ✅ 전달받은 정보 로깅
        // 필요하다면 다른 로직 추가 (예: 로컬 스토리지에 일부 사용자 정보 저장)
      } else {
        alert("로그인 실패!");
        console.error("로그인 실패 - 서버 응답:", res); // 서버 응답 로깅
      }
    } catch (err) {
      console.error("로그인 요청 실패", err);
      alert("로그인 실패!");
    }
  };

  const logout = async () => {
    try {
      const res = await axiosInstance.post("/logout"); // 로그아웃 API 호출
      if (res.status === 200 || res.status === 204) {
        localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 제거
        setIsLoggedIn(false); // 로그인 상태 false로 설정
        setUser(null); // 유저 정보 초기화
        alert("로그아웃 되었습니다");
        navigate("/"); // 로그아웃 후 메인페이지로 리디렉션
      } else {
        console.error("로그아웃 실패 - 서버 응답 오류", res);
        alert("로그아웃 실패");
      }
    } catch (err) {
      console.error("로그아웃 요청 실패", err);
      alert("로그아웃 실패");
    }
  };

  // 컴포넌트 마운트 시 세션 확인 및 초기 사용자 정보 로드
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
          // 401 오류는 로그인되지 않은 상태이므로 별도의 알림 없이 상태만 업데이트
          return;
        }
        console.error("세션 확인 실패", err);
        setIsLoggedIn(false);
        setUser(null);
        console.warn("로그인 상태를 확인할 수 없습니다.");
      }
    };

    checkSession();
  }, []);

  // 로그인 상태가 변경될 때 (주로 로그인/로그아웃 시) 사용자 정보 갱신
  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    } else {
      setUser(null); // 로그아웃 상태로 설정
    }
  }, [isLoggedIn, fetchUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

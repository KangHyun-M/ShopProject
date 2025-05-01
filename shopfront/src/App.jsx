import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./component/authContext";
import Navbar from "./component/NavBar"; // 경로 확인

function App() {
  useEffect(() => {
    const csrfTokenMeta = document.querySelector("meta[name='_csrf']");
    if (csrfTokenMeta) {
      const csrfToken = csrfTokenMeta.content;
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* 모든 페이지 상단에 네비게이션 바 포함 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* 아래 두 개는 새로 만들거나 필요시 추가 */}
          <Route path="/cart" element={<div>장바구니</div>} />
          <Route path="/mypage" element={<div>마이페이지</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

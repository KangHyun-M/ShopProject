import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./component/authContext";

function App() {
  useEffect(() => {
    //서버에서 렌더링된 HTML문서에서 CSRF 토큰을 가져오는 로직
    const csrfTokenMeta = document.querySelector("meta[name='_csrf']");

    //CSRF토큰이 존재하는지 확인 후 요청 헤더에 추가
    if (csrfTokenMeta) {
      const csrfToken = csrfTokenMeta.content;
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
    }
  }, []);

  return (
    <AuthProvider>
      {/*전체 앱을 authprovider로 감싸서 로그인 상태 전역으로 관리*/}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

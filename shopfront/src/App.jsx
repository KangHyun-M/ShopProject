// App.js
import axios from "axios";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./component/authContext";
import AppLayout from "./AppLayout"; // 레이아웃 컴포넌트로 분리

function App() {
  useEffect(() => {
    const csrfTokenMeta = document.querySelector("meta[name='_csrf']");
    if (csrfTokenMeta) {
      const csrfToken = csrfTokenMeta.content;
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 자동으로 포함하여 세션 ID 전송　クッキーを自動的に含めてセッションIDを送信します
});

export default axiosInstance;

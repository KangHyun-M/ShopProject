import axios from "axios";

// 共通Axiosインスタンスの作成
const axiosInstance = axios.create({
  // 全てのリクエストの基本URL（バックエンドの /api ルートに向けて）
  baseURL: "/api",

  // JSON形式でリクエスト送信
  headers: {
    "Content-Type": "application/json",
  },

  // 認証情報（クッキーなど）を自動で含める
  withCredentials: true, // クッキーを自動的に含めてセッションIDを送信
});

export default axiosInstance;

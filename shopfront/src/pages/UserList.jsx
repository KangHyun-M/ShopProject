import React, { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import Swal from "sweetalert2";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ユーザー一覧を取得（管理者用）
  useEffect(() => {
    axiosInstance
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("ユーザー一覧取得失敗", err);
        Swal.fire("エラー", "ユーザー一覧の取得に失敗しました", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  // ローディング中表示
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">読み込み中です...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* ヘッダー */}
      <h3 className="fw-bold mb-4">👥 ユーザー一覧</h3>

      {/* ユーザーが存在しない場合 */}
      {users.length === 0 ? (
        <p className="text-muted">登録されたユーザーが存在しません。</p>
      ) : (
        users.map((user) => (
          <Card
            key={user.userId}
            className="mb-3 p-3 shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            <p className="mb-1">
              <strong>メールアドレス：</strong> {user.username}
            </p>
            <p className="mb-0">
              <strong>ニックネーム：</strong> {user.usernic}
            </p>
          </Card>
        ))
      )}
    </Container>
  );
}

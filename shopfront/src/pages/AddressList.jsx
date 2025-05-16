import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

export default function AddressList() {
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        const role = res.data.role;
        if (role !== "USER" && role !== "ADMIN") {
          Swal.fire(
            "アクセス拒否",
            "管理者またはユーザーのみアクセス可能です",
            "warning"
          );
          navigate("/");
        } else {
          fetchAddressList();
        }
      })
      .catch(() => {
        Swal.fire("未ログイン", "ログインが必要です", "info");
        navigate("/login");
      });
  }, [navigate]);

  const fetchAddressList = () => {
    axiosInstance
      .get("/user/address")
      .then((res) => setAddressList(res.data))
      .catch((err) => {
        console.error("住所取得失敗", err);
        Swal.fire("エラー", "住所情報を取得できませんでした", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "確認",
      text: "この住所を本当に削除しますか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "はい、削除します",
      cancelButtonText: "キャンセル",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/user/address/${id}`);
      Swal.fire("削除完了", "住所が削除されました", "success");
      setAddressList((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("住所削除失敗", err);
      Swal.fire("エラー", "削除に失敗しました", "error");
    }
  };

  const handleSetMain = async (id) => {
    try {
      await axiosInstance.patch(`/user/address/${id}/main`);
      Swal.fire("成功", "メイン住所に設定されました", "success");
      fetchAddressList();
    } catch (err) {
      console.error("メイン住所設定失敗", err);
      Swal.fire("エラー", "メイン住所の設定に失敗しました", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>登録された住所</h4>
        <Button onClick={() => navigate("/mypage/newaddress")}>
          新しい住所を追加
        </Button>
      </div>

      <Row>
        {addressList.length === 0 ? (
          <p>登録された住所がありません。</p>
        ) : (
          addressList.map((addr) => (
            <Col md={6} lg={4} key={addr.id} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Subtitle className="text-muted mb-1">
                    郵便番号
                  </Card.Subtitle>
                  <Card.Text>{addr.zipcode}</Card.Text>

                  <Card.Subtitle className="text-muted mb-1">
                    住所
                  </Card.Subtitle>
                  <Card.Text>{addr.address}</Card.Text>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/mypage/address/${addr.id}`)}
                    >
                      詳細を見る
                    </Button>

                    <Button
                      variant="outline-success"
                      size="sm"
                      disabled={addr.isMain}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMain(addr.id);
                      }}
                    >
                      {addr.isMain ? "メイン住所" : "メインに設定"}
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                    >
                      削除
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";
import { categories } from "../component/categories";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function ItemRegistration() {
  const navigate = useNavigate();

  // フォーム入力状態
  const [form, setForm] = useState({
    itemname: "",
    description: "",
    price: 0,
    category: "",
  });

  // 画像ファイル・プレビュー
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // 管理者チェック（未ログイン or 一般ユーザーならリダイレクト）
  useEffect(() => {
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          Swal.fire("アクセス拒否", "管理者しかアクセスできません", "warning");
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire("ログインエラー", "ログインしてください", "error");
        navigate("/login");
      });
  }, [navigate]);

  // 入力変更ハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 画像アップロード時の処理（プレビュー生成）
  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewImages(previews);
  };

  // 商品登録実行
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const itemWithMain = {
      ...form,
      mainImg: mainImageIndex,
    };

    const itemBlob = new Blob([JSON.stringify(itemWithMain)], {
      type: "application/json",
    });

    formData.append("item", itemBlob);
    images.forEach((img) => formData.append("images", img));

    try {
      await axiosInstance.post("/admin/registration", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("成功", "商品登録が完了しました", "success").then(() =>
        navigate("/admin/items")
      );
    } catch (err) {
      console.error(err);
      Swal.fire("エラー", "商品登録に失敗しました", "error");
    }
  };

  return (
    <Container style={{ maxWidth: "700px" }} className="py-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-center">商品登録</h3>

        {/* 商品登録フォーム */}
        <Form onSubmit={handleSubmit}>
          {/* 商品名 */}
          <Form.Group className="mb-3">
            <Form.Label>商品名</Form.Label>
            <Form.Control
              name="itemname"
              value={form.itemname}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* 商品説明 */}
          <Form.Group className="mb-3">
            <Form.Label>説明</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* 価格 */}
          <Form.Group className="mb-3">
            <Form.Label>価格</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* カテゴリー選択 */}
          <Form.Group className="mb-3">
            <Form.Label>カテゴリー</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">選択してください</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* 画像アップロード */}
          <Form.Group className="mb-3">
            <Form.Label>商品画像アップロード</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </Form.Group>

          {/* サムネイル選択（メイン画像） */}
          {previewImages.length > 0 && (
            <div className="mb-3">
              <Form.Label>サムネイル選択（メイン画像）</Form.Label>
              <Row>
                {previewImages.map((img, index) => (
                  <Col xs={6} md={4} key={index} className="mb-3 text-center">
                    <Image
                      src={img.url}
                      alt={`preview-${index}`}
                      thumbnail
                      style={{ height: "100px", objectFit: "contain" }}
                    />
                    <Form.Check
                      type="radio"
                      name="mainImage"
                      label="サムネイル"
                      checked={mainImageIndex === index}
                      onChange={() => setMainImageIndex(index)}
                      className="mt-2"
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* 登録ボタン */}
          <div className="text-center">
            <Button type="submit" variant="primary">
              登録する
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

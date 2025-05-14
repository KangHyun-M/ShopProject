import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  Image,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { categories } from "../component/categories";

export default function AdminItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({
    itemname: "",
    description: "",
    price: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImage, setMainImage] = useState("");

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
        Swal.fire("エラー", "ログインしてください", "error");
        navigate("/login");
      });

    axiosInstance
      .get(`/items/${id}`)
      .then((res) => {
        setItem(res.data);
        setForm({
          itemname: res.data.itemname,
          description: res.data.description,
          price: res.data.price,
          category: res.data.category,
        });
        setExistingImages(res.data.imagePaths || []);
        setMainImage(res.data.mainImage || res.data.imagePaths?.[0] || "");
      })
      .catch(() => {
        Swal.fire("エラー", "該当する商品は存在しません", "error");
        navigate("/admin/items");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleImageDelete = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
    if (mainImage === url) setMainImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const updatedItem = {
      ...form,
      remainImg: existingImages,
      mainImgPath: mainImage,
    };

    const itemBlob = new Blob([JSON.stringify(updatedItem)], {
      type: "application/json",
    });
    formData.append("item", itemBlob);
    images.forEach((img) => formData.append("images", img));

    try {
      await axiosInstance.put(`/admin/items/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("成功", "商品の修正が完了しました", "success").then(() => {
        navigate("/admin/items");
      });
    } catch (err) {
      console.error(err);
      Swal.fire("エラー", "修正に失敗しました", "error");
    }
  };

  if (!item)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-center">商品情報修正</h3>

        <h5>既存の画像</h5>
        <Row className="mb-4">
          {existingImages.map((img, idx) => (
            <Col key={idx} xs={6} md={4} className="mb-3 text-center">
              <Image
                src={img}
                alt={`既存の画像 ${idx + 1}`}
                thumbnail
                style={{ height: "150px", objectFit: "contain" }}
              />
              <div className="mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleImageDelete(img)}
                >
                  削除
                </Button>
                <Form.Check
                  type="radio"
                  name="mainImage"
                  label="サムネイル"
                  checked={mainImage === img}
                  onChange={() => setMainImage(img)}
                />
              </div>
            </Col>
          ))}
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>商品名</Form.Label>
            <Form.Control
              type="text"
              name="itemname"
              value={form.itemname}
              onChange={handleChange}
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>カテゴリー</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">選択</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>追加イメージアップロード</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button type="submit" variant="primary">
              修正完了
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

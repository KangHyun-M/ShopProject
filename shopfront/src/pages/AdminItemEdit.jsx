import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Row,
  Col,
} from "react-bootstrap";
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
  const [mainImage, setMainImage] = useState(""); // 대표 이미지 경로

  useEffect(() => {
    // 관리자 체크 및 데이터 로드
    axiosInstance
      .get("/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          alert("관리자만 접근 가능합니다.");
          navigate("/");
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다.");
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
        alert("상품 정보를 불러오지 못했습니다.");
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
    if (mainImage === url) {
      setMainImage(""); // 대표 이미지로 지정되어 있던 이미지가 삭제될 경우 초기화
    }
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
      alert("수정 완료");
      navigate("/admin/items");
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  if (!item) return <p className="text-center mt-5">로딩 중...</p>;

  return (
    <Container className="py-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4 text-center">상품 정보 수정</h3>

      {/* 기존 이미지 미리보기 */}
      <Card className="mb-4 p-3">
        <h5>기존 이미지</h5>
        <Row>
          {existingImages.map((img, idx) => (
            <Col key={idx} xs={6} md={4} className="mb-3 text-center">
              <Image
                src={img}
                alt={`기존 이미지 ${idx + 1}`}
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
                  삭제
                </Button>
                <Form.Check
                  type="radio"
                  name="mainImage"
                  label="대표 이미지"
                  checked={mainImage === img}
                  onChange={() => setMainImage(img)}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 수정 폼 */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>상품명</Form.Label>
          <Form.Control
            type="text"
            name="itemname"
            value={form.itemname}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>설명</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>가격</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>카테고리</Form.Label>
          <Form.Select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">선택</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>추가 이미지 업로드</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </Form.Group>

        <div className="text-center">
          <Button type="submit" variant="primary">
            수정 완료
          </Button>
        </div>
      </Form>
    </Container>
  );
}

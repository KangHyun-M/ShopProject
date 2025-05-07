import React, { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ItemRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemname: "",
    description: "",
    price: 0,
    category: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const itemBlob = new Blob([JSON.stringify(form)], {
      type: "application/json",
    });

    formData.append("item", itemBlob);
    images.forEach((img) => formData.append("images", img));

    try {
      await axiosInstance.post("/admin/registration", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("상품 등록 성공");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("상품 등록 실패");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>상품명</label>
          <input
            name="itemname"
            value={form.itemname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>카테고리</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">선택</option>
            <option value="CPU">CPU</option>
            <option value="GPU">GPU</option>
            <option value="RAM">RAM</option>
            <option value="Motherboard">Motherboard</option>
            <option value="Storage">Storage</option>
            <option value="Power Supply">Power Supply</option>
          </select>
        </div>

        <div>
          <label>이미지</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <button type="submit">등록</button>
      </form>
    </div>
  );
}

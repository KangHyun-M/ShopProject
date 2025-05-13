import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCartItems = location.state?.cartItemIds || [];

  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newZipcode, setNewZipcode] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    axiosInstance.get("/user/address").then((res) => {
      setAddressList(res.data);
      const main = res.data.find((addr) => addr.isMain);
      if (main) setSelectedAddress(main);
    });
  }, []);

  const handleSubmit = async () => {
    const data = {
      cartItemIds: selectedCartItems,
      zipcode: newZipcode || selectedAddress?.zipcode,
      address: newAddress || selectedAddress?.address,
    };

    try {
      await axiosInstance.post("/user/orders", data);
      alert("注文が完了しました");
      navigate("/mypage/orders");
    } catch (err) {
      alert("注文に失敗しました");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>注文ページ</h3>

      <div>
        <h5>배송 주소 선택</h5>
        {addressList.map((addr) => (
          <div key={addr.id}>
            <input
              type="radio"
              name="addr"
              checked={selectedAddress?.id === addr.id}
              onChange={() => setSelectedAddress(addr)}
            />
            [{addr.zipcode}] {addr.address} {addr.isMain && "(대표 주소)"}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h5>새로운 주소 입력</h5>
        <input
          type="text"
          placeholder="우편번호"
          value={newZipcode}
          onChange={(e) => setNewZipcode(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="주소"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        주문하기
      </button>
    </div>
  );
}

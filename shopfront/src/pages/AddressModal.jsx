// src/pages/AddressSearchModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function AddressModal({ show, onClose, onSelect }) {
  const [zipcode, setZipcode] = useState("");
  const [result, setResult] = useState(null);

  const search = async () => {
    try {
      const res = await axios.get(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
      );
      if (res.data.results) {
        setResult(res.data.results[0]);
      } else {
        alert("該当する住所が見つかりませんでした");
        setResult(null);
      }
    } catch (e) {
      alert("検索に失敗しました");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>住所検索</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>郵便番号</Form.Label>
          <Form.Control
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="例: 0600062"
          />
        </Form.Group>
        <Button className="mt-2" onClick={search}>
          検索
        </Button>

        {result && (
          <div className="mt-3">
            <p>
              {result.address1}
              {result.address2}
              {result.address3}
            </p>
            <Button
              variant="success"
              onClick={() => {
                onSelect(result);
                onClose();
              }}
            >
              この住所を使用
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

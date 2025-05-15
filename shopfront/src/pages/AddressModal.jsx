import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddressModal({
  show,
  onClose,
  onSelect,
  initialZipcode,
}) {
  const [zipcode, setZipcode] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (show) {
      setZipcode(initialZipcode || "");
      setResult(null);
    }
  }, [show, initialZipcode]);

  const search = async () => {
    try {
      const res = await axios.get(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
      );
      if (res.data.results) {
        setResult(res.data.results[0]);
      } else {
        Swal.fire("該当なし", "一致する住所が見つかりませんでした", "warning");
        setResult(null);
      }
    } catch (e) {
      Swal.fire("エラー", "住所検索に失敗しました", "error");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>住所検索</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>郵便番号を入力</Form.Label>
          <Form.Control
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="例：0600062"
          />
        </Form.Group>
        <Button className="mt-2 w-100" onClick={search}>
          🔍 検索する
        </Button>

        {result && (
          <div className="mt-3 p-3 border rounded bg-light">
            <p className="mb-2">
              <strong>検索結果：</strong>
              <br />
              {result.address1} {result.address2} {result.address3}
            </p>
            <Button
              variant="success"
              className="w-100"
              onClick={() => {
                onSelect(result);
                onClose();
              }}
            >
              この住所を使用する
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

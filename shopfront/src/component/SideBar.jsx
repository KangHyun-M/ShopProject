import React from "react";
import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div
      className="bg-light border-end"
      style={{
        width: "250px",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* 管理メニューのタイトル */}
      <h5 className="mb-4 fw-bold">管理メニュー</h5>

      <Accordion alwaysOpen flush>
        {/* 会員管理セクション */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>会員管理</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/admin/users" className="ps-4 py-2">
                会員リスト
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>

        {/* 商品管理セクション */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>商品管理</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/admin/items" className="ps-4 py-2">
                商品リスト
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/itemregistration"
                className="ps-4 py-2"
              >
                商品登録
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/items/deleted"
                className="ps-4 py-2"
              >
                商品復旧
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

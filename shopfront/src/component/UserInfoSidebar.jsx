import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserInfoSidebar() {
  return (
    <div
      className="bg-light border-end"
      style={{ width: "240px", minHeight: "100vh", padding: "20px" }}
    >
      {/* サイドバーのタイトル */}
      <h5 className="fw-bold mb-4">マイページ</h5>

      <Accordion alwaysOpen flush>
        {/* マイページメニュー */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>マイページ</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              {/* プロフィール確認 */}
              <Nav.Link as={Link} to="/mypage/info" className="ps-4 py-2">
                プロフィール
              </Nav.Link>
              {/* 注文履歴 */}
              <Nav.Link as={Link} to="/mypage/orders" className="ps-4 py-2">
                注文履歴
              </Nav.Link>

              {/* パスワード変更 */}
              <Nav.Link
                as={Link}
                to="/mypage/change-password"
                className="ps-4 py-2"
              >
                パスワード変更
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>

        {/* 住所管理メニュー */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>住所管理</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              {/* 新しい住所を追加 */}
              <Nav.Link as={Link} to="/mypage/newaddress" className="ps-4 py-2">
                住所追加
              </Nav.Link>
              {/* 登録済み住所リスト */}
              <Nav.Link
                as={Link}
                to="/mypage/addresslist"
                className="ps-4 py-2"
              >
                住所リスト
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

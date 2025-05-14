import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserInfoSidebar() {
  return (
    <div
      className="bg-light border-end"
      style={{ width: "240px", minHeight: "100vh", padding: "20px" }}
    >
      <h5 className="fw-bold mb-4">마이페이지</h5>

      <Accordion alwaysOpen flush>
        {/* 내 정보 */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>내 정보</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/mypage/info" className="ps-4 py-2">
                내 정보 보기
              </Nav.Link>
              <Nav.Link as={Link} to="/mypage/orders" className="ps-4 py-2">
                주문내역 보기
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>

        {/* 정보 변경 */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>정보 변경</Accordion.Header>
          <Accordion.Body className="p-0">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/mypage/newaddress" className="ps-4 py-2">
                주소 추가
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/mypage/addresslist"
                className="ps-4 py-2"
              >
                주소 목록
              </Nav.Link>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

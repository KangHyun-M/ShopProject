import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./authContext";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4 border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          タイトル未定
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-links" />
        <Navbar.Collapse id="nav-links">
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/">
              ホーム
            </Nav.Link>
            <Nav.Link as={Link} to="/user/cart">
              🛒 カート
            </Nav.Link>
            <Nav.Link as={Link} to="/mypage/info">
              👤 マイページ
            </Nav.Link>
            {user?.role === "ADMIN" && (
              <Nav.Link as={Link} to="/admin" className="text-danger fw-bold">
                🔧 アドミンページ
              </Nav.Link>
            )}
          </Nav>

          <Nav className="gap-2">
            {user ? (
              <NavDropdown
                title={`👋 ${user.username} (${user.role})`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  🔓 ログアウト
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="btn btn-outline-primary rounded"
                >
                  ログイン
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="btn btn-outline-success rounded"
                >
                  会員登録
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

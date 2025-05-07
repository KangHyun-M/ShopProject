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
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          제목 미정
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-links" />
        <Navbar.Collapse id="nav-links">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              홈
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              장바구니
            </Nav.Link>
            <Nav.Link as={Link} to="/mypage">
              마이페이지
            </Nav.Link>
            {user?.role === "ADMIN" && (
              <Nav.Link as={Link} to="/admin">
                관리자페이지
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown
                title={`${user.username} (${user.role})`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  로그아웃
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                로그인
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

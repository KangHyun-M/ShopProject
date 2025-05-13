import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/UserInfoSidebar.css";

export default function UserInfoSidebar() {
  const [hovered, setHovered] = useState(null);

  const menu = [
    {
      title: "내 정보",
      submenu: [{ name: "내 정보 보기", path: "/mypage/info" }],
    },
    {
      title: "정보 변경",
      submenu: [
        { name: "주소 추가", path: "/mypage/newaddress" },
        { name: "주소 목록", path: "/mypage/addresslist" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {menu.map((m, idx) => (
        <div
          className="menu"
          key={idx}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="menu-title">{m.title}</div>
          {hovered === idx && (
            <div className="submenu">
              {m.submenu.map((sub, i) => (
                <Link to={sub.path} className="submenu-item" key={i}>
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

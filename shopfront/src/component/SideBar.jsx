import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/SideBar.css";

export default function SideBar() {
  const [hovered, setHovered] = useState(null);

  const menu = [
    {
      title: "회원관리",
      submenu: [
        { name: "회원 목록", path: "/admin/users" },
        { name: "회원 등록", path: "/admin/users/create" },
      ],
    },
    {
      title: "상품관리",
      submenu: [
        { name: "상품 목록", path: "/admin/items" },
        { name: "상품 등록", path: "/admin/itemregistration" },
        { name: "상품 복구", path: "/admin/items/deleted" },
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

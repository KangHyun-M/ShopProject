import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/SideBar.css";

export default function SideBar() {
  const [hovered, setHovered] = useState(null);

  const menu = [
    {
      title: "会員管理",
      submenu: [
        { name: "会員リスト", path: "/admin/users" },
        { name: "会員登録", path: "/admin/users/create" },
      ],
    },
    {
      title: "商品管理",
      submenu: [
        { name: "商品リスト", path: "/admin/items" },
        { name: "商品登録", path: "/admin/itemregistration" },
        { name: "商品復旧", path: "/admin/items/deleted" },
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

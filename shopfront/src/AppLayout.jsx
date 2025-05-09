import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./component/NavBar";
import SideBar from "./component/SideBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ItemDetail from "./pages/ItemDetail";
import ItemRegistration from "./pages/ItemRegistration";
import AdminPage from "./pages/AdminPage";
import "./css/Layout.css";
import AdminItemList from "./pages/AdminItemList";
import AdminItemEdit from "./pages/AdminItemEdit";
import ItemRestorePage from "./pages/ItemRestorePage";
import CartPage from "./pages/CartPage";

export default function AppLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app-layout">
      <div className="navbar-fixed">
        <Navbar />
      </div>

      {isAdminPage && <SideBar />}

      <div className={`content-area ${isAdminPage ? "with-sidebar" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/items" element={<AdminItemList />} />
          <Route path="/admin/items/edit/:id" element={<AdminItemEdit />} />
          <Route
            path="/admin/itemregistration"
            element={<ItemRegistration />}
          />
          <Route path="/admin/items/deleted" element={<ItemRestorePage />} />
        </Routes>
      </div>
    </div>
  );
}

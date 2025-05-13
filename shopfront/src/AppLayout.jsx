import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/NavBar";
import SideBar from "./component/SideBar"; // 관리자용 사이드바
import UserInfoSidebar from "./component/UserInfoSidebar"; // 마이페이지용 사이드바
import "./css/Layout.css";

// 페이지 컴포넌트
import Address from "./pages/Address";
import CartPage from "./pages/CartPage";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserInfo from "./pages/UserInfo";

// 관리자 페이지
import AdminItemEdit from "./pages/AdminItemEdit";
import AdminItemList from "./pages/AdminItemList";
import AdminPage from "./pages/AdminPage";
import ItemRegistration from "./pages/ItemRegistration";
import ItemRestorePage from "./pages/ItemRestorePage";
import AddressList from "./pages/AddressList";
import AddressDetail from "./pages/AddressDetail";
import OrderList from "./pages/OrderList";
import OrderPage from "./pages/OrderPage";

export default function AppLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isMyPage = location.pathname.startsWith("/mypage");

  return (
    <div className="app-layout">
      {/* 상단 고정 네비게이션 */}
      <div className="navbar-fixed">
        <Navbar />
      </div>

      {/* 조건부 사이드바 */}
      {isAdminPage && <SideBar />}
      {isMyPage && <UserInfoSidebar />}

      {/* 콘텐츠 영역 */}
      <div
        className={`content-area ${
          isAdminPage || isMyPage ? "with-sidebar" : ""
        }`}
      >
        <Routes>
          {/* 일반 사용자 라우트 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/address" element={<Address />} />

          {/* 마이페이지 라우트 */}
          <Route path="/mypage/info" element={<UserInfo />} />
          <Route path="/mypage/newaddress" element={<Address />} />
          <Route path="/mypage/addresslist" element={<AddressList />} />
          <Route path="/mypage/address/:id" element={<AddressDetail />} />

          {/* 관리자 라우트 */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/items" element={<AdminItemList />} />
          <Route path="/admin/items/edit/:id" element={<AdminItemEdit />} />
          <Route
            path="/admin/itemregistration"
            element={<ItemRegistration />}
          />
          <Route path="/admin/items/deleted" element={<ItemRestorePage />} />

          {/* 주문관련 */}
          <Route path="/mypage/orders" element={<OrderList />} />
          <Route path="/mypage/orderpage" element={<OrderPage />} />
        </Routes>
      </div>
    </div>
  );
}

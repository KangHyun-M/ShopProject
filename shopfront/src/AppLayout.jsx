import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/NavBar";
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
import AddressDetail from "./pages/AddressDetail";
import AddressList from "./pages/AddressList";
import AdminItemEdit from "./pages/AdminItemEdit";
import AdminItemList from "./pages/AdminItemList";
import AdminPage from "./pages/AdminPage";
import ItemRegistration from "./pages/ItemRegistration";
import ItemRestorePage from "./pages/ItemRestorePage";
import OrderList from "./pages/OrderList";
import OrderPage from "./pages/OrderPage";
import UserDetail from "./pages/UserDetail";
import UserList from "./pages/UserList";

export default function AppLayout() {
  const location = useLocation();
  const isMyPage = location.pathname.startsWith("/mypage");

  return (
    <div className="app-layout">
      <div className="navbar-fixed">
        <Navbar />
      </div>

      <div className="main-layout">
        {/*{isAdminPage && <SideBar />}*/}
        {isMyPage && <UserInfoSidebar />}

        <div className="content-area">
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
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/:userId" element={<UserDetail />} />

            {/* 주문 관련 */}
            <Route path="/mypage/orders" element={<OrderList />} />
            <Route path="/mypage/orderpage" element={<OrderPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

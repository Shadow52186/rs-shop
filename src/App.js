import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // ✅ เพิ่ม Navigate
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { login } from "./store/userSlice";

// Admin Pages
import ManageUser from "./components/pages/admin/ManageUser";
import ManageCategory from "./components/pages/admin/ManageCategory";
import Addproduct from "./components/pages/admin/Addproduct";
import EditProduct from "./components/EditProduct";
import ManageStock from "./components/pages/admin/ManageStock";

// User Pages
import HomePage from "./components/pages/user/HomePage";
import CategoryPage from "./components/pages/user/CategoryPage";
import AllProductsPage from "./components/pages/user/AllProductsPage";
import ProductDetailPage from "./components/pages/user/ProductDetailPage";
import UserProfilePage from "./components/pages/user/UserProfilePage";
import PromotionPage from "./components/pages/user/PromotionPage";

// Auth Pages
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";

// Layout
import ResponsiveAppBar from "./layout/ResponsiveAppBar";
import { CssBaseline } from "@mui/material";

// Not Found
import NotFound404 from "./components/pages/Notfound404";

// Route protection
import AdminRoute from "./routes/AdminRoute";
import TopupPage from "./components/pages/user/TopupPage";
import PurchaseHistoryPage from "./components/pages/user/PurchaseHistoryPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(login(decoded));
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        {/* ✅ Redirect root / ไป /user/index */}
        <Route path="/" element={<Navigate to="/user/index" replace />} />

        {/* Public Routes */}
        <Route path="*" element={<NotFound404 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/user/index"
          element={
            <>
              <ResponsiveAppBar />
              <HomePage />
            </>
          }
        />
        <Route
          path="/category/:id"
          element={
            <>
              <ResponsiveAppBar />
              <CategoryPage />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <ResponsiveAppBar />
              <AllProductsPage />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <ResponsiveAppBar />
              <ProductDetailPage />
            </>
          }
        />
        <Route
          path="/topup"
          element={
            <>
              <ResponsiveAppBar />
              <TopupPage />
            </>
          }
        />
        <Route
          path="/user/history"
          element={
            <>
              <ResponsiveAppBar />
              <PurchaseHistoryPage />
            </>
          }
        />
        <Route
          path="/user/profile"
          element={
            <>
              <ResponsiveAppBar />
              <UserProfilePage />
            </>
          }
        />
        <Route
          path="/promotions"
          element={
            <>
              <ResponsiveAppBar />
              <PromotionPage />
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/viewtable"
          element={
            <AdminRoute>
              <ResponsiveAppBar />
              <Addproduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <AdminRoute>
              <ResponsiveAppBar />
              <EditProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ResponsiveAppBar />
              <ManageUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-category"
          element={
            <AdminRoute>
              <ResponsiveAppBar />
              <ManageCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock/:id"
          element={
            <AdminRoute>
              <ResponsiveAppBar />
              <ManageStock />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

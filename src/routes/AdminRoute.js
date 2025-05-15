// src/routes/AdminRoute.js
import React from "react";
import { useSelector } from "react-redux";
import SideBar from "../layout/SideBar";
import HeaderBar from "../layout/HeaderBar";
import { Box } from "@mui/material";
import NotFound404 from "../components/pages/Notfound404"; // ✅ เพิ่ม

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.value);

  // 🔐 ถ้าไม่ใช่ admin → แสดง 404 แทน
  if (user?.role !== "admin") {
    return <NotFound404 />;
  }

  return (
    <div className="app">
      <SideBar />
      <main className="content">
        <HeaderBar />
        <div className="content_body">
          <Box m="20px">{children}</Box>
          <p>🔐 User State: {user?.username} ({user?.role})</p>
        </div>
      </main>
    </div>
  );
};

export default AdminRoute;

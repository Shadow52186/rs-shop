import React from "react";
import SideBar from "../layout/SideBar";
import HeaderBar from "../layout/HeaderBar";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const AdminLayout = ({ children }) => {
  const user = useSelector((state) => state.user.value);

  if (user?.role !== "admin") {
    return <p>🚫 Access Denied</p>;
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

export default AdminLayout;

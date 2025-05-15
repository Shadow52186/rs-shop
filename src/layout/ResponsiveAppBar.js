import React, { useState } from "react";
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem,
  Button, Box, Container, Drawer, List, ListItem, ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const pages = [
  { title: "หน้าหลัก", to: "/user/index" },
  { title: "สินค้า", to: "/products" },
  { title: "เติมเงิน", to: "/topup" },
  { title: "โปรโมชั่น", to: "/promotions" },
];

function ResponsiveAppBar() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user && user.role === "admin"; // ✅ ตรวจสอบ role

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (e) => setAnchorElUser(e.currentTarget);
  const handleUserMenuClose = () => setAnchorElUser(null);

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate("/login");
  };

  const handleGoToProfile = () => {
    handleUserMenuClose();
    navigate("/user/profile");
  };

  const handleGoToHistory = () => {
    handleUserMenuClose();
    navigate("/user/history");
  };

  const handleGoToAdmin = () => {
    handleUserMenuClose();
    navigate("/admin/viewtable"); // ✅ ไปหน้าหลังบ้าน
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", width: 300, fontFamily: "Prompt, sans-serif" }}
    >
      <img src="/logo.png" alt="Logo" style={{ width: 80, margin: 16 }} />
      <List>
        {pages.map((item, index) => (
          <ListItem button key={index} component={Link} to={item.to}>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: 16,
                color: "#000"
              }}
            />
          </ListItem>
        ))}
        {!user ? (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="เข้าสู่ระบบ" primaryTypographyProps={{ fontWeight: 600, color: "#000" }} />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="สมัครสมาชิก" primaryTypographyProps={{ fontWeight: 600, color: "#000" }} />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="ออกจากระบบ" primaryTypographyProps={{ fontWeight: 600, color: "#000" }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{
      backgroundColor: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      fontFamily: "Prompt, sans-serif"
    }}>
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 80,
          }}
        >
          {/* Hamburger */}
          <IconButton
            edge="start"
            sx={{ display: { xs: "flex", md: "none" }, color: "#000" }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box display="flex" alignItems="center">
            <img src="/logo.png" alt="logo" style={{ width: 50 }} />
          </Box>

          {/* Menu desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
              ml: "auto",
              mr: "auto"
            }}
          >
            {pages.map((item, index) => (
              <Button
                key={index}
                component={Link}
                to={item.to}
                sx={{
                  color: "#000",
                  fontWeight: 600,
                  fontFamily: "Prompt, sans-serif",
                  fontSize: "16px",
                  textTransform: "none"
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!user ? (
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: "none", color: "#000",
                    borderColor: "#d000f7", borderRadius: "12px",
                    fontFamily: "Prompt, sans-serif",
                    fontWeight: 600
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  startIcon={<PersonAddAltIcon />}
                  sx={{
                    textTransform: "none", color: "#000",
                    borderColor: "#d000f7", borderRadius: "12px",
                    fontFamily: "Prompt, sans-serif",
                    fontWeight: 600
                  }}
                >
                  สมัครสมาชิก
                </Button>
              </Box>
            ) : (
              <>
                <Button
                  onClick={handleUserMenuOpen}
                  variant="outlined"
                  startIcon={<AccountCircleIcon />}
                  sx={{
                    textTransform: "none", borderColor: "#d000f7",
                    color: "#000", borderRadius: "12px",
                    fontFamily: "Prompt, sans-serif",
                    fontWeight: 600
                  }}
                >
                  {user.username}
                </Button>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleGoToProfile}>โปรไฟล์</MenuItem>
                  <MenuItem onClick={handleGoToHistory}>ประวัติการซื้อ</MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={handleGoToAdmin}>จัดการหลังบ้าน</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer (mobile menu) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: 300 } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default ResponsiveAppBar;

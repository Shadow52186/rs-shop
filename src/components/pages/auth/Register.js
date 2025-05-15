import React, { useState } from "react";
import {
  Box, Button, Card, CssBaseline, FormControl, FormLabel,
  TextField, Typography, Link, Stack
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ เพิ่ม popup

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Register
      await axios.post(`${process.env.REACT_APP_API}/register`, form);

      // 2. Auto login
      const res = await axios.post(`${process.env.REACT_APP_API}/login`, form);
      const token = res.data.token;
      const role = res.data.user.role;

      // 3. Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ✅ Popup success
      await Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "ระบบจะพาคุณเข้าสู่ระบบโดยอัตโนมัติ",
        timer: 1800,
        timerProgressBar: true,
        confirmButtonText: "ตกลง"
      });

      // 4. Redirect
      if (role === "admin") {
        navigate("/admin/viewtable");
      } else {
        navigate("/user/index");
      }

    } catch (err) {
      console.error(err);
      // ❌ Popup error
      Swal.fire({
        icon: "error",
        title: "ไม่สำเร็จ",
        text: "ลงทะเบียนไม่สำเร็จ หรือบัญชีนี้มีอยู่แล้ว",
        confirmButtonText: "ลองอีกครั้ง"
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f0fff0"
      >
        <Card sx={{ p: 4, width: "100%", maxWidth: 450 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            สมัครสมาชิก
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <FormLabel>ชื่อผู้ใช้</FormLabel>
              <TextField
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>รหัสผ่าน</FormLabel>
              <TextField
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              สมัครและเข้าสู่ระบบ
            </Button>

            <Stack alignItems="center" spacing={1} mt={2}>
              <Typography variant="body2">
                มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
              </Typography>
            </Stack>
          </form>
        </Card>
      </Box>
    </>
  );
};

export default Register;

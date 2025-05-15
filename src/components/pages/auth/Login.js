import React, { useState } from "react";
import {
  Box, Button, Card, CssBaseline, FormControl, FormLabel,
  TextField, Typography, Link, Stack
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/login`, form);
      const token = res.data.token;
      const role = res.data.user.role;

      // ✅ บันทึก token และ role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ✅ แสดง popup สำเร็จ
      await Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เข้าสู่ระบบสำเร็จ",
        confirmButtonText: "OK",
        timer: 1800,
        timerProgressBar: true,
      });

      // ✅ ไปยังหน้า admin หรือ user
      if (role === "admin") {
        navigate("/admin/viewtable");
      } else {
        navigate("/user/index");
      }

    } catch (err) {
      if (err.response?.status === 429) {
        // ⛔ โดนบล็อกชั่วคราว
        Swal.fire({
          icon: "error",
          title: "ถูกบล็อกชั่วคราว",
          text: "คุณพยายามเข้าสู่ระบบมากเกินไป โปรดลองใหม่อีกครั้งใน 15 นาที",
          confirmButtonText: "รับทราบ",
        });
      } else if (err.response?.status === 401) {
        // ❗ รหัสผิด แต่ยังไม่ถูกบล็อก
        const remaining = err.response.headers["x-ratelimit-remaining"];

        Swal.fire({
          icon: "warning",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: remaining !== undefined
            ? `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง\nเหลืออีก ${remaining} ครั้งก่อนถูกบล็อก`
            : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          confirmButtonText: "ลองอีกครั้ง",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
          confirmButtonText: "ปิด",
        });
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#f0fff0">
        <Card sx={{ p: 4, width: "100%", maxWidth: 450 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            เข้าสู่ระบบ
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
              เข้าสู่ระบบ
            </Button>

            <Stack alignItems="center" spacing={1} mt={2}>
              <Typography variant="body2">
                ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
              </Typography>
            </Stack>
          </form>
        </Card>
      </Box>
    </>
  );
};

export default Login;

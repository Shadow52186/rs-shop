import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import ParticlesBackground from "../../../components/effects/ParticlesBackground";
import { motion } from "framer-motion";

const TopupPage = () => {
  const [link, setLink] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleRedeemTopup = async () => {
    if (!link || !link.includes("truemoney.com")) {
      return Swal.fire("ลิงก์ไม่ถูกต้อง", "กรุณาวางลิงก์ซองอั่งเปา", "warning");
    }
    if (!token) return Swal.fire("กรุณาเข้าสู่ระบบ", "", "warning");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/topup/redeem`, { link }, config);
      Swal.fire("✅ สำเร็จ", res.data.message, "success");
      setLink("");
    } catch (err) {
      Swal.fire("❌ ล้มเหลว", err.response?.data?.error || "เกิดข้อผิดพลาด", "error");
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(270deg, #ffe6f0, #f3e5f5, #e1bee7)",
        backgroundSize: "600% 600%",
        animation: "gradientShift 15s ease infinite",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <ParticlesBackground />
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box maxWidth="500px" mx="auto" p={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                เติม Point ด้วยซองอั่งเปา
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                กรุณาสร้าง <b>ซองอั่งเปา TrueMoney</b> และคัดลอกลิงก์มาใส่ด้านล่าง
              </Typography>

              <Box sx={{ mb: 2, textAlign: "center" }}>
                <img
                  src="/assets/aungpao_truewallet_01.jpg"
                  alt="ตัวอย่างลิงก์ซองอั่งเปา"
                  style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
                />
              </Box>

              <Stack spacing={2}>
                <TextField
                  label="ลิงก์ซองอั่งเปา TrueMoney"
                  fullWidth
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRedeemTopup}
                >
                  🎁 เติมด้วยซองอั่งเปา
                </Button>
              </Stack>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default TopupPage;
